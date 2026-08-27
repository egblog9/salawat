import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Persistent Stats Helper
const STATS_FILE = path.join(process.cwd(), "stats.json");

interface StatsData {
  visitorsCount: number;
  totalTasbeehat: number;
  lastUpdated: string;
}

// In-memory set of registered visitors today/session to prevent duplicate increments
const recentVisitors = new Set<string>();

function getStats(): StatsData {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (typeof parsed.visitorsCount === "number" && typeof parsed.totalTasbeehat === "number") {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading stats file:", err);
  }
  // Real baseline initial stats (starts cleanly with genuine live user interactions)
  const initialStats: StatsData = {
    visitorsCount: 1,
    totalTasbeehat: 0,
    lastUpdated: new Date().toISOString(),
  };
  saveStats(initialStats);
  return initialStats;
}

function saveStats(stats: StatsData) {
  try {
    stats.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving stats file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Global CORS and cache-busting headers for API
  app.use("/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get Live Website Stats
  app.get("/api/stats", (req, res) => {
    const stats = getStats();
    res.json(stats);
  });

  // Log a genuine visitor visit
  app.post("/api/stats/visit", (req, res) => {
    const visitorId = req.body?.visitorId || req.ip || "unknown";
    const stats = getStats();
    
    // Check if this visitor ID was already logged recently
    if (!recentVisitors.has(visitorId)) {
      recentVisitors.add(visitorId);
      stats.visitorsCount += 1;
      saveStats(stats);
    }

    res.json({
      success: true,
      visitorsCount: stats.visitorsCount,
      totalTasbeehat: stats.totalTasbeehat,
    });
  });

  // Increment Tasbeeh (real collective count on website)
  app.post("/api/stats/tasbeeh", (req, res) => {
    const { count = 1 } = req.body;
    const incrementAmount = Math.max(1, Math.min(Number(count) || 1, 100));
    const stats = getStats();
    stats.totalTasbeehat += incrementAmount;
    saveStats(stats);
    res.json({
      success: true,
      totalTasbeehat: stats.totalTasbeehat,
      visitorsCount: stats.visitorsCount,
    });
  });

  // Generate Islamic Reminder / Virtue of Salawat for sharing cards using gemini-3.7-flash
  app.post("/api/reminder", async (req, res) => {
    try {
      const { topic = "salawat" } = req.body;
      const ai = getGeminiClient();

      const prompt = `أنت مساعد إسلامي حكيم وبليغ. اكتب بطاقة تذكير ورسالة قصيرة وجميلة ومؤثرة جداً للتذكير بـ "${topic === 'salawat' ? 'الصلاة على النبي ﷺ وفضلها' : topic}" لمشاركتها مع الأهل والأصدقاء ("وتفكر غيرك").
يجب أن تحتوي الرسالة على:
1. عنوان ملهم وجذاب.
2. صيغة صلاة على النبي ﷺ مع التشكيل الدقيق.
3. حديث نبوي شريف صحيح أو فائدة روحية/إيمانية موجزة وموثقة عن فضل الصلاة عليه ﷺ.
4. دعوة لطيفة للمشاركة وتذكير الغير.
5. نص قصير جاهز للمشاركة السريعة عبر الواتساب وفيسبوك ووسائل التواصل مع رابط صفحة الفيسبوك للتواصل: https://www.facebook.com/share/1Bm2aq9mKm/.

أخرج النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "title": "عنوان البطاقة",
  "salawatText": "صيغة الصلاة على النبي مشكولة",
  "virtue": "الفضل والحديث النبوي الشريف",
  "shareText": "النص الكامل الجاهز للنسخ والمشاركة مع الأصدقاء",
  "tags": ["صلاة_على_النبي", "تذكير_الخير"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Reminder generation error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate reminder.",
      });
    }
  });

  // Serve PWA and static files from public directory
  const publicDir = path.join(process.cwd(), "public");
  
  // Explicit PWA routes with correct Content-Type and Service Worker headers
  app.get("/manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.sendFile(path.join(publicDir, "manifest.json"));
  });

  app.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.join(publicDir, "sw.js"));
  });

  app.use(express.static(publicDir));

  // Vite middleware in dev or static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Salawat Sheikh Audio & Stats Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
