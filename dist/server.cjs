var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var rootDir = process.cwd();
import_dotenv.default.config();
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  app.use(import_express.default.json());
  app.use(import_express.default.static(import_path.default.resolve(rootDir, "public")));
  app.get(["/expositor_cerca_mejorado.jpg", "/expositor.jpg", "/expositor.png"], (_req, res) => {
    res.sendFile(import_path.default.resolve(rootDir, "public", "expositor_cerca_mejorado.svg"));
  });
  app.get(["/tarjeta_mejorada.jpg", "/tarjeta.jpg", "/tarjeta.png"], (_req, res) => {
    res.sendFile(import_path.default.resolve(rootDir, "public", "tarjeta_mejorada.svg"));
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const systemInstruction = `Eres 'Asesor Consultor de RESEO STUDIO', un experto en SEO Local y ventas de alta conversi\xF3n para negocios locales.

REGLAS DE ORO OBLIGATORIAS:
1. ULTRA CONCISO Y DIRECTO: Respuestas cortas de 2 o 3 frases contundentes (m\xE1ximo 50-60 palabras). Sin rodeos ni parrafadas.
2. ENFOQUE CONSULTIVO CON VALOR: Aclara la duda t\xE9cnica en 1 o 2 l\xEDneas clave (por qu\xE9 el NFC en 3s bate al QR, por qu\xE9 la geolocalizaci\xF3n GPS valida la rese\xF1a en Maps, etc.).
3. CIERRE COMERCIAL OBLIGATORIO (CTA EN CADA MENSAJE): Termina SIEMPRE guiando al cliente al siguiente paso de venta:
   - Inv\xEDtale a solicitar su V\xCDDEO-DEMO GRATUITA DE 60s personalizada con la ficha de su negocio en Google Maps o a dejar su n\xFAmero de WhatsApp/email para prepar\xE1rsela en menos de 24h.
4. PRECIOS: Si preguntan precio, resume directo: Pack Mostrador Pro (59\u20AC), Pack Comercio + Equipo (99\u20AC \u2B50 M\xE1s Vendido) o Gran Equipo (159\u20AC). Todos con +144\u20AC en bonos gratis y 14 d\xEDas de Garant\xEDa.`;
      const openAiKey = process.env.OPENAI_API_KEY || "";
      if (openAiKey && openAiKey.startsWith("sk-")) {
        try {
          const openAiMessages = [
            { role: "system", content: systemInstruction }
          ];
          if (Array.isArray(history)) {
            for (const h of history.slice(-6)) {
              openAiMessages.push({
                role: h.role === "user" ? "user" : "assistant",
                content: (h.content || "").replace(/<[^>]*>?/gm, " ")
              });
            }
          }
          openAiMessages.push({ role: "user", content: message });
          const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: openAiMessages,
              temperature: 0.7,
              max_tokens: 300
            })
          });
          const oaiData = await oaiRes.json();
          if (oaiData?.choices?.[0]?.message?.content) {
            let raw = oaiData.choices[0].message.content;
            const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            const formatted = escaped.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return res.json({ reply: formatted, fallback: false });
          }
        } catch (oaiErr) {
          console.warn("OpenAI API call failed, falling back to Gemini:", oaiErr);
        }
      }
      const ai = getGeminiClient();
      if (ai) {
        let formattedContents = "";
        if (Array.isArray(history) && history.length > 0) {
          formattedContents = history.map((h) => {
            const speaker = h.role === "user" ? "Cliente" : "Asesor RESEO STUDIO";
            const cleanContent = (h.content || "").replace(/<[^>]*>?/gm, " ");
            return `${speaker}: ${cleanContent}`;
          }).join("\n") + `
Cliente: ${message}`;
        } else {
          formattedContents = message;
        }
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
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
  const dataDir = import_path.default.resolve(rootDir, "data");
  const leadsFile = import_path.default.resolve(dataDir, "leads.json");
  function readLeadsFromFile() {
    try {
      if (!import_fs.default.existsSync(dataDir)) {
        import_fs.default.mkdirSync(dataDir, { recursive: true });
      }
      if (!import_fs.default.existsSync(leadsFile)) {
        import_fs.default.writeFileSync(leadsFile, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = import_fs.default.readFileSync(leadsFile, "utf-8");
      return JSON.parse(raw) || [];
    } catch (err) {
      console.error("Error reading leads file:", err);
      return [];
    }
  }
  function writeLeadsToFile(leads) {
    try {
      if (!import_fs.default.existsSync(dataDir)) {
        import_fs.default.mkdirSync(dataDir, { recursive: true });
      }
      import_fs.default.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing leads file:", err);
    }
  }
  app.get("/api/leads", (_req, res) => {
    const leads = readLeadsFromFile();
    res.json({ success: true, leads });
  });
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
  async function syncLeadToAirtable(lead) {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return;
    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Oportunidades%20(Pipeline)`;
      const fields = {
        "Name": `${lead.negocio || "Lead"} - ${lead.pack || "Demo"}`,
        "Negocio / Empresa": lead.negocio || "",
        "Persona de Contacto": lead.contacto || "",
        "Tel\xE9fono": lead.telefono || "",
        "Email": lead.email || "",
        "Ciudad / Zona": lead.ciudad || "",
        "Fase del Pipeline": "\u{1F4E5} 1. Nuevo Lead / Sin Contactar",
        "Pack Interesado": lead.pack?.includes("99") ? "Pack Comercio + Equipo (99\u20AC \u2B50 M\xE1s Vendido)" : lead.pack?.includes("159") ? "Pack Gran Equipo (159\u20AC)" : "Pack Mostrador Pro (59\u20AC)",
        "Temperatura": "\u{1F525} Caliente / Urgente",
        "Origen del Lead": lead.origen?.includes("Chat") ? "\u{1F916} Chatbot Asesor IA" : "\u{1F310} Formulario Web",
        "Pr\xF3ximo Paso Concreto": "Enviar v\xEDdeo de 60s analizando su ficha de Google Maps",
        "Fecha Pr\xF3ximo Seguimiento": new Date(Date.now() + 36e5 * 2).toISOString(),
        "Notes": `Lead entrante captado desde la web. Tipo: ${lead.tipo || "Demo"}. Fecha: ${(/* @__PURE__ */ new Date()).toLocaleString("es-ES")}`
      };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records: [{ fields }] })
      });
      if (res.ok) {
        console.log("\u2705 Lead sincronizado autom\xE1ticamente con Airtable:", lead.negocio);
      } else {
        console.warn("Airtable sync response:", await res.text());
      }
    } catch (e) {
      console.error("Error sincronizando lead con Airtable:", e);
    }
  }
  app.post("/api/leads", (req, res) => {
    try {
      const lead = req.body;
      const leads = readLeadsFromFile();
      const existingIdx = leads.findIndex((l) => l.id === lead.id);
      if (existingIdx >= 0) {
        leads[existingIdx] = { ...leads[existingIdx], ...lead };
      } else {
        leads.unshift(lead);
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
  app.patch("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const leads = readLeadsFromFile();
      const index = leads.findIndex((l) => l.id === id);
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
  app.delete("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      let leads = readLeadsFromFile();
      leads = leads.filter((l) => l.id !== id);
      writeLeadsToFile(leads);
      res.json({ success: true });
    } catch (e) {
      console.error("Error in DELETE /api/leads:", e);
      res.status(500).json({ success: false });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: import_path.default.resolve(rootDir)
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = import_path.default.resolve(rootDir, "index.html");
        let template = import_fs.default.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = import_path.default.resolve(rootDir, "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RESEO STUDIO Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
