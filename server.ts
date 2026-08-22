import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

const rootDir = process.cwd();

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());
  app.use(express.static(path.resolve(rootDir, "public")));

  // Asset route handlers for product hardware images
  app.get(["/expositor_cerca_mejorado.jpg", "/expositor.jpg", "/expositor.png"], (_req, res) => {
    res.sendFile(path.resolve(rootDir, "public", "expositor_cerca_mejorado.svg"));
  });

  app.get(["/tarjeta_mejorada.jpg", "/tarjeta.jpg", "/tarjeta.png"], (_req, res) => {
    res.sendFile(path.resolve(rootDir, "public", "tarjeta_mejorada.svg"));
  });

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chat endpoint powered by Gemini & OpenAI fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const systemInstruction = `Eres 'Asesor Consultor de RESEO STUDIO', un experto en SEO Local y ventas de alta conversión para negocios locales.

REGLAS DE ORO OBLIGATORIAS:
1. ULTRA CONCISO Y DIRECTO: Respuestas cortas de 2 o 3 frases contundentes (máximo 50-60 palabras). Sin rodeos ni parrafadas.
2. ENFOQUE CONSULTIVO CON VALOR: Aclara la duda técnica en 1 o 2 líneas clave (por qué el NFC en 3s bate al QR, por qué la geolocalización GPS valida la reseña en Maps, etc.).
3. CIERRE COMERCIAL OBLIGATORIO (CTA EN CADA MENSAJE): Termina SIEMPRE guiando al cliente al siguiente paso de venta:
   - Invítale a solicitar su VÍDEO-DEMO GRATUITA DE 60s personalizada con la ficha de su negocio en Google Maps o a dejar su número de WhatsApp/email para preparársela en menos de 24h.
4. PRECIOS: Si preguntan precio, resume directo: Pack Mostrador Pro (59€), Pack Comercio + Equipo (99€ ⭐ Más Vendido) o Gran Equipo (159€). Todos con +144€ en bonos gratis y 14 días de Garantía.`;

      // 1. Try OpenAI gpt-4o-mini if OPENAI_API_KEY is available
      const openAiKey = process.env.OPENAI_API_KEY || "";
      if (openAiKey && openAiKey.startsWith("sk-")) {
        try {
          const openAiMessages = [
            { role: "system", content: systemInstruction },
          ];
          if (Array.isArray(history)) {
            for (const h of history.slice(-6)) {
              openAiMessages.push({
                role: h.role === "user" ? "user" : "assistant",
                content: (h.content || "").replace(/<[^>]*>?/gm, " "),
              });
            }
          }
          openAiMessages.push({ role: "user", content: message });

          const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: openAiMessages,
              temperature: 0.7,
              max_tokens: 300,
            }),
          });

          const oaiData = await oaiRes.json();
          if (oaiData?.choices?.[0]?.message?.content) {
            let raw = oaiData.choices[0].message.content;
            // Sanitize raw text to prevent XSS while allowing bold and breaks
            const escaped = raw
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
            
            const formatted = escaped
              .replace(/\n\n/g, "<br><br>")
              .replace(/\n/g, "<br>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return res.json({ reply: formatted, fallback: false });
          }
        } catch (oaiErr) {
          console.warn("OpenAI API call failed, falling back to Gemini:", oaiErr);
        }
      }

      // 2. Try Gemini
      const ai = getGeminiClient();
      if (ai) {
        let formattedContents = "";
        if (Array.isArray(history) && history.length > 0) {
          formattedContents = history
            .map((h: { role: string; content: string }) => {
              const speaker = h.role === 'user' ? 'Cliente' : 'Asesor RESEO STUDIO';
              const cleanContent = (h.content || '').replace(/<[^>]*>?/gm, ' ');
              return `${speaker}: ${cleanContent}`;
            })
            .join('\n') + `\nCliente: ${message}`;
        } else {
          formattedContents = message;
        }

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const rawGemini = response.text || "";
        const escaped = rawGemini
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

        const replyText = escaped
          .replace(/\n\n/g, "<br><br>")
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return res.json({ reply: replyText, fallback: false });
      }

      res.json({ fallback: true });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.json({ fallback: true });
    }
  });

  // Leads Database File Path
  const dataDir = path.resolve(rootDir, "data");
  const leadsFile = path.resolve(dataDir, "leads.json");

  function readLeadsFromFile(): any[] {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (!fs.existsSync(leadsFile)) {
        fs.writeFileSync(leadsFile, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = fs.readFileSync(leadsFile, "utf-8");
      return JSON.parse(raw) || [];
    } catch (err) {
      console.error("Error reading leads file:", err);
      return [];
    }
  }

  function writeLeadsToFile(leads: any[]): void {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing leads file:", err);
    }
  }

  // GET all leads
  app.get("/api/leads", (_req, res) => {
    const leads = readLeadsFromFile();
    res.json({ success: true, leads });
  });

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";

  async function syncLeadToAirtable(lead: any) {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return;
    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Oportunidades%20(Pipeline)`;
      const fields: Record<string, any> = {
        "Name": `${lead.negocio || 'Lead'} - ${lead.pack || 'Demo'}`,
        "Negocio / Empresa": lead.negocio || '',
        "Persona de Contacto": lead.contacto || '',
        "Teléfono": lead.telefono || '',
        "Email": lead.email || '',
        "Ciudad / Zona": lead.ciudad || '',
        "Fase del Pipeline": "📥 1. Nuevo Lead / Sin Contactar",
        "Pack Interesado": lead.pack?.includes('99') ? "Pack Comercio + Equipo (99€ ⭐ Más Vendido)" : lead.pack?.includes('159') ? "Pack Gran Equipo (159€)" : "Pack Mostrador Pro (59€)",
        "Temperatura": "🔥 Caliente / Urgente",
        "Origen del Lead": lead.origen?.includes('Chat') ? "🤖 Chatbot Asesor IA" : "🌐 Formulario Web",
        "Próximo Paso Concreto": "Enviar vídeo de 60s analizando su ficha de Google Maps",
        "Fecha Próximo Seguimiento": new Date(Date.now() + 3600000 * 2).toISOString(),
        "Notes": `Lead entrante captado desde la web. Tipo: ${lead.tipo || 'Demo'}. Fecha: ${new Date().toLocaleString('es-ES')}`
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [{ fields }] })
      });
      if (res.ok) {
        console.log("✅ Lead sincronizado automáticamente con Airtable:", lead.negocio);
      } else {
        console.warn("Airtable sync response:", await res.text());
      }
    } catch (e) {
      console.error("Error sincronizando lead con Airtable:", e);
    }
  }

  // POST create / update lead
  app.post("/api/leads", (req, res) => {
    try {
      const lead = req.body;
      const leads = readLeadsFromFile();
      const existingIdx = leads.findIndex((l: any) => l.id === lead.id);
      
      if (existingIdx >= 0) {
        leads[existingIdx] = { ...leads[existingIdx], ...lead };
      } else {
        leads.unshift(lead);
        // Automatic sync to Airtable for newly captured leads
        syncLeadToAirtable(lead).catch(console.error);
      }
      
      writeLeadsToFile(leads);
      console.log("Lead guardado correctamente en data/leads.json:", lead.negocio);
      res.json({ success: true, leads, target_email: "reseostudio@gmail.com" });
    } catch (e) {
      console.error("Error in /api/leads:", e);
      res.status(500).json({ success: false });
    }
  });

  // PATCH update lead by ID
  app.patch("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const leads = readLeadsFromFile();
      const index = leads.findIndex((l: any) => l.id === id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Lead no encontrado" });
      }
      
      leads[index] = { ...leads[index], ...updates };
      writeLeadsToFile(leads);
      res.json({ success: true, lead: leads[index] });
    } catch (e) {
      console.error("Error in PATCH /api/leads:", e);
      res.status(500).json({ success: false });
    }
  });

  // DELETE lead by ID
  app.delete("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      let leads = readLeadsFromFile();
      leads = leads.filter((l: any) => l.id !== id);
      writeLeadsToFile(leads);
      res.json({ success: true });
    } catch (e) {
      console.error("Error in DELETE /api/leads:", e);
      res.status(500).json({ success: false });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.resolve(rootDir),
    });
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
  });
}

startServer();
