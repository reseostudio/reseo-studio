import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Database from "better-sqlite3";

const rootDir = process.cwd();
dotenv.config();

/* ------------------------------------------------------------------ */
/*  AUTENTICACIÓN (contraseña única de administrador)                  */
/* ------------------------------------------------------------------ */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const TOKEN_SECRET =
  process.env.TOKEN_SECRET ||
  (ADMIN_PASSWORD
    ? crypto.createHash("sha256").update("reseostudio:" + ADMIN_PASSWORD).digest("hex")
    : crypto.randomBytes(32).toString("hex"));
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function verifyPassword(input: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

function signToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
    if (expected.length !== sig.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

function getToken(req: express.Request): string | null {
  const h = req.headers.authorization || "";
  if (h.startsWith("Bearer ")) return h.slice(7).trim();
  return null;
}

function requireAuth(req: express.Request, res: express.Response): boolean {
  const t = getToken(req);
  if (t && verifyToken(t)) return true;
  res.status(401).json({ success: false, error: "No autorizado" });
  return false;
}

/* ------------------------------------------------------------------ */
/*  BASE DE DATOS SQLite                                               */
/* ------------------------------------------------------------------ */

const dataDir = path.resolve(rootDir, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.resolve(dataDir, "crm.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  tipo TEXT,
  negocio TEXT NOT NULL,
  ciudad TEXT,
  contacto TEXT,
  email TEXT,
  telefono TEXT,
  pack TEXT,
  timestamp TEXT,
  target_email TEXT,
  origen TEXT,
  status TEXT DEFAULT 'nuevo',
  demoSent INTEGER DEFAULT 0,
  demoSentDate TEXT,
  notas TEXT,
  valorEstimado REAL,
  followUpStage INTEGER DEFAULT 1,
  nextFollowUp TEXT,
  lastContactDate TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL,
  type TEXT,
  content TEXT,
  created_at TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_followup ON leads(nextFollowUp);
`);

/* Cadencia de la secuencia de 5 impactos (días entre impacto N y N+1) */
const FOLLOW_UP_CADENCE: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 3 };

interface LeadRow {
  id: string;
  tipo: string | null;
  negocio: string;
  ciudad: string | null;
  contacto: string | null;
  email: string | null;
  telefono: string | null;
  pack: string | null;
  timestamp: string | null;
  target_email: string | null;
  origen: string | null;
  status: string;
  demoSent: number;
  demoSentDate: string | null;
  notas: string | null;
  valorEstimado: number | null;
  followUpStage: number;
  nextFollowUp: string | null;
  lastContactDate: string | null;
  created_at: string | null;
  updated_at: string | null;
}

function rowToLead(r: LeadRow) {
  const activities = db
    .prepare("SELECT id, type, content, created_at FROM activities WHERE lead_id = ? ORDER BY created_at DESC, id DESC")
    .all(r.id)
    .map((a: any) => ({ id: a.id, type: a.type, content: a.content, created_at: a.created_at }));
  return {
    id: r.id,
    tipo: r.tipo || "",
    negocio: r.negocio,
    ciudad: r.ciudad || "",
    contacto: r.contacto || "",
    email: r.email || "",
    telefono: r.telefono || "",
    pack: r.pack || "",
    timestamp: r.timestamp || new Date().toISOString(),
    target_email: r.target_email || "",
    origen: r.origen || "",
    status: r.status || "nuevo",
    demoSent: !!r.demoSent,
    demoSentDate: r.demoSentDate || undefined,
    notas: r.notas || "",
    valorEstimado: r.valorEstimado || undefined,
    followUpStage: r.followUpStage || 1,
    nextFollowUp: r.nextFollowUp || undefined,
    lastContactDate: r.lastContactDate || undefined,
    activities,
  };
}

function logActivity(leadId: string, type: string, content: string) {
  db.prepare("INSERT INTO activities (lead_id, type, content, created_at) VALUES (?, ?, ?, ?)").run(
    leadId,
    type,
    content,
    new Date().toISOString()
  );
}

function addDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/* ------------------------------------------------------------------ */
/*  IA (chatbot)                                                       */
/* ------------------------------------------------------------------ */

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
  }
  return aiClient;
}

// Llamada genérica a cualquier API compatible con OpenAI (DeepSeek, OpenAI, etc.)
async function openAiCompatibleChat(
  apiKey: string,
  baseUrl: string,
  model: string,
  systemInstruction: string,
  history: any[],
  message: string
): Promise<string | null> {
  const messages: any[] = [{ role: "system", content: systemInstruction }];
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      messages.push({ role: h.role === "user" ? "user" : "assistant", content: (h.content || "").replace(/<[^>]*>?/gm, " ") });
    }
  }
  messages.push({ role: "user", content: message });
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 300 }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "5mb" }));
  app.use(express.static(path.resolve(rootDir, "public")));

  // Asset route handlers for product hardware images
  app.get(["/expositor_cerca_mejorado.jpg", "/expositor.jpg", "/expositor.png"], (_req, res) => {
    res.sendFile(path.resolve(rootDir, "public", "expositor_cerca_mejorado.svg"));
  });
  app.get(["/tarjeta_mejorada.jpg", "/tarjeta.jpg", "/tarjeta.png"], (_req, res) => {
    res.sendFile(path.resolve(rootDir, "public", "tarjeta_mejorada.svg"));
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  /* ---------- AUTENTICACIÓN ---------- */
  app.post("/api/auth/login", (req, res) => {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ success: false, error: "ADMIN_PASSWORD no configurada en el servidor" });
    }
    const { password } = req.body || {};
    if (typeof password === "string" && verifyPassword(password)) {
      return res.json({ success: true, token: signToken() });
    }
    return res.status(401).json({ success: false, error: "Contraseña incorrecta" });
  });

  app.get("/api/auth/check", (req, res) => {
    if (requireAuth(req, res)) res.json({ success: true });
  });

  /* ---------- LEADS (CRUD) ---------- */

  // Listado (solo admin)
  app.get("/api/leads", (req, res) => {
    if (!requireAuth(req, res)) return;
    const rows = db.prepare("SELECT * FROM leads ORDER BY COALESCE(nextFollowUp, timestamp, created_at) ASC").all() as LeadRow[];
    res.json({ success: true, leads: rows.map(rowToLead) });
  });

  // Alta de lead — PÚBLICA (formulario web + chatbot)
  app.post("/api/leads", (req, res) => {
    try {
      const lead = req.body || {};
      const now = new Date().toISOString();
      const id = lead.id || "lead_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const status = lead.status || "nuevo";
      db.prepare(
        `INSERT INTO leads (id, tipo, negocio, ciudad, contacto, email, telefono, pack, timestamp, target_email, origen, status, demoSent, demoSentDate, notas, valorEstimado, followUpStage, nextFollowUp, lastContactDate, created_at, updated_at)
         VALUES (@id, @tipo, @negocio, @ciudad, @contacto, @email, @telefono, @pack, @timestamp, @target_email, @origen, @status, @demoSent, @demoSentDate, @notas, @valorEstimado, 1, @nextFollowUp, @lastContactDate, @now, @now)`
      ).run({
        id,
        tipo: lead.tipo || "Lead Web",
        negocio: lead.negocio || "Negocio sin nombre",
        ciudad: lead.ciudad || "",
        contacto: lead.contacto || "",
        email: lead.email || "",
        telefono: lead.telefono || "",
        pack: lead.pack || "",
        timestamp: lead.timestamp || now,
        target_email: lead.target_email || "reseostudio@gmail.com",
        origen: lead.origen || "Web",
        status,
        demoSent: lead.demoSent ? 1 : 0,
        demoSentDate: lead.demoSentDate || null,
        notas: lead.notas || "",
        valorEstimado: lead.valorEstimado || null,
        nextFollowUp: lead.nextFollowUp || addDaysFromNow(1),
        lastContactDate: lead.lastContactDate || null,
        now,
      });
      logActivity(id, "creado", `Lead creado vía ${lead.origen || "Web"}`);
      res.json({ success: true, lead: rowToLead(db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow) });
    } catch (e) {
      console.error("Error en POST /api/leads:", e);
      res.status(500).json({ success: false });
    }
  });

  // Importación CSV (solo admin)
  app.post("/api/import", (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { rows } = req.body || {};
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ success: false, error: "Sin filas para importar" });
      }
      let inserted = 0;
      const now = new Date().toISOString();
      const ins = db.prepare(
        `INSERT INTO leads (id, tipo, negocio, ciudad, contacto, email, telefono, pack, timestamp, target_email, origen, status, demoSent, demoSentDate, notas, followUpStage, nextFollowUp, created_at, updated_at)
         VALUES (@id, @tipo, @negocio, @ciudad, @contacto, @email, @telefono, @pack, @timestamp, @target_email, @origen, @status, 0, NULL, @notas, 1, @nextFollowUp, @now, @now)`
      );
      for (const r of rows) {
        if (!r || !r.negocio) continue;
        const id = "lead_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + inserted;
        ins.run({
          id,
          tipo: r.tipo || "Importado",
          negocio: String(r.negocio),
          ciudad: r.ciudad || "",
          contacto: r.contacto || "",
          email: r.email || "",
          telefono: r.telefono || "",
          pack: r.pack || "Pack Comercio + Equipo (99€)",
          timestamp: now,
          target_email: "reseostudio@gmail.com",
          origen: r.origen || "Importación CSV",
          status: r.status || "nuevo",
          notas: r.notas || "",
          nextFollowUp: now,
          now,
        });
        logActivity(id, "importado", "Lead importado desde CSV");
        inserted++;
      }
      res.json({ success: true, inserted });
    } catch (e) {
      console.error("Error en /api/import:", e);
      res.status(500).json({ success: false });
    }
  });

  // Actualización de lead (solo admin)
  app.patch("/api/leads/:id", (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const existing = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow | undefined;
      if (!existing) return res.status(404).json({ success: false, message: "Lead no encontrado" });

      const updates = req.body || {};
      const next: LeadRow = { ...existing, ...updates };
      db.prepare(
        `UPDATE leads SET tipo=@tipo, negocio=@negocio, ciudad=@ciudad, contacto=@contacto, email=@email, telefono=@telefono, pack=@pack, timestamp=@timestamp, target_email=@target_email, origen=@origen, status=@status, demoSent=@demoSent, demoSentDate=@demoSentDate, notas=@notas, valorEstimado=@valorEstimado, followUpStage=@followUpStage, nextFollowUp=@nextFollowUp, lastContactDate=@lastContactDate, updated_at=@now WHERE id=@id`
      ).run({
        id,
        tipo: next.tipo,
        negocio: next.negocio,
        ciudad: next.ciudad,
        contacto: next.contacto,
        email: next.email,
        telefono: next.telefono,
        pack: next.pack,
        timestamp: next.timestamp,
        target_email: next.target_email,
        origen: next.origen,
        status: next.status,
        demoSent: next.demoSent ? 1 : 0,
        demoSentDate: next.demoSentDate || null,
        notas: next.notas,
        valorEstimado: next.valorEstimado || null,
        followUpStage: next.followUpStage || 1,
        nextFollowUp: next.nextFollowUp || null,
        lastContactDate: next.lastContactDate || null,
        now: new Date().toISOString(),
      });
      res.json({ success: true, lead: rowToLead(db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow) });
    } catch (e) {
      console.error("Error en PATCH /api/leads/:id:", e);
      res.status(500).json({ success: false });
    }
  });

  // Eliminar lead (solo admin)
  app.delete("/api/leads/:id", (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM leads WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (e) {
      console.error("Error en DELETE /api/leads/:id:", e);
      res.status(500).json({ success: false });
    }
  });

  // Añadir nota/actividad y (opcionalmente) avanzar seguimiento
  app.post("/api/leads/:id/activities", (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const existing = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow | undefined;
      if (!existing) return res.status(404).json({ success: false, message: "Lead no encontrado" });

      const { type = "nota", content = "", advance = false } = req.body || {};
      const now = new Date().toISOString();
      logActivity(id, type, content || "");

      let followUpStage = existing.followUpStage || 1;
      let nextFollowUp = existing.nextFollowUp;
      let lastContactDate = existing.lastContactDate;

      if (advance || ["demo", "mensaje", "llamada", "seguimiento"].includes(type)) {
        lastContactDate = now;
        const days = FOLLOW_UP_CADENCE[followUpStage];
        if (days !== undefined && followUpStage < 5) {
          followUpStage = followUpStage + 1;
          nextFollowUp = addDaysFromNow(days);
        } else if (followUpStage >= 5) {
          nextFollowUp = null; // secuencia completada
        }
        logActivity(id, "seguimiento", `Impacto ${Math.min(followUpStage, 5)} realizado · próximo en ${days ?? "—"} días`);
      }

      db.prepare("UPDATE leads SET followUpStage=@s, nextFollowUp=@n, lastContactDate=@l, updated_at=@now WHERE id=@id").run({
        s: followUpStage,
        n: nextFollowUp,
        l: lastContactDate,
        now,
        id,
      });
      res.json({ success: true, lead: rowToLead(db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow) });
    } catch (e) {
      console.error("Error en POST /api/leads/:id/activities:", e);
      res.status(500).json({ success: false });
    }
  });

  // Chat endpoint: DeepSeek (primario) → OpenAI (opcional) → Gemini (opcional)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const systemInstruction = `Eres 'Asesor Consultor de RESEO STUDIO', un experto en SEO Local y ventas de alta conversión para negocios locales.\n\nREGLAS DE ORO OBLIGATORIAS:\n1. ULTRA CONCISO Y DIRECTO: Respuestas cortas de 2 o 3 frases contundentes (máximo 50-60 palabras). Sin rodeos ni parrafadas.\n2. ENFOQUE CONSULTIVO CON VALOR: Aclara la duda técnica en 1 o 2 líneas clave (por qué el NFC en 3s bate al QR, por qué la geolocalización GPS valida la reseña en Maps, etc.).\n3. CIERRE COMERCIAL OBLIGATORIO (CTA EN CADA MENSAJE): Termina SIEMPRE guiando al cliente al siguiente paso de venta:\n   - Invítale a solicitar su VÍDEO-DEMO GRATUITA DE 60s personalizada con la ficha de su negocio en Google Maps o a dejar su número de WhatsApp/email para preparársela en menos de 24h.\n4. PRECIOS: Si preguntan precio, resume directo: Pack Mostrador Pro (59€), Pack Comercio + Equipo (99€ ⭐ Más Vendido) o Gran Equipo (159€). Todos con +144€ en bonos gratis y 14 días de Garantía.`;

      const deepSeekKey = process.env.DEEPSEEK_API_KEY || "";
      const openAiKey = process.env.OPENAI_API_KEY || "";

      let raw: string | null = null;

      // 1. DeepSeek (motor principal)
      if (deepSeekKey) {
        try {
          raw = await openAiCompatibleChat(deepSeekKey, "https://api.deepseek.com", "deepseek-chat", systemInstruction, history, message);
        } catch (e) {
          console.warn("DeepSeek falló, probando OpenAI:", e);
        }
      }

      // 2. OpenAI (opcional, si algún día la regeneras)
      if (!raw && openAiKey.startsWith("sk-")) {
        try {
          raw = await openAiCompatibleChat(openAiKey, "https://api.openai.com/v1", "gpt-4o-mini", systemInstruction, history, message);
        } catch (e) {
          console.warn("OpenAI falló, probando Gemini:", e);
        }
      }

      if (raw) {
        const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        const formatted = escaped.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return res.json({ reply: formatted, fallback: false });
      }

      const ai = getGeminiClient();
      if (ai) {
        let formattedContents = "";
        if (Array.isArray(history) && history.length > 0) {
          formattedContents =
            history
              .map((h: { role: string; content: string }) => {
                const speaker = h.role === "user" ? "Cliente" : "Asesor RESEO STUDIO";
                const cleanContent = (h.content || "").replace(/<[^>]*>?/gm, " ");
                return `${speaker}: ${cleanContent}`;
              })
              .join("\n") + `\nCliente: ${message}`;
        } else {
          formattedContents = message;
        }

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: formattedContents,
          config: { systemInstruction, temperature: 0.7 },
        });

        const rawGemini = response.text || "";
        const escaped = rawGemini.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        const replyText = escaped.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return res.json({ reply: replyText, fallback: false });
      }

      res.json({ fallback: true });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.json({ fallback: true });
    }
  });

  // Vite middleware (dev) / estáticos (producción)
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa", root: path.resolve(rootDir) });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(rootDir, "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(rootDir, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RESEO STUDIO Server running on http://0.0.0.0:${PORT}`);
    if (!ADMIN_PASSWORD) console.warn("⚠️  ADMIN_PASSWORD no configurada: el login del CRM está deshabilitado.");
  });
}

startServer();
