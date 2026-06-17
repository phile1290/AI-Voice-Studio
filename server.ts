import express from "express";
import path from "path";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import axios from "axios";

// Memory storage for audio uploads
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Proxy TTS endpoint (Upgraded to Edge TTS for unlimited, free usage without API keys)
  app.post("/api/gemini/tts", async (req, res) => {
    try {
      const { text, edgeVoice, edgePitch, edgeRate, speed } = req.body;
      
      const tts = new MsEdgeTTS();
      await tts.setMetadata(edgeVoice || 'vi-VN-NamMinhNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

      const { audioStream } = tts.toStream(text);
      
      const chunks: Buffer[] = [];
      await new Promise((resolve, reject) => {
          audioStream.on('data', (c: Buffer) => chunks.push(c));
          audioStream.on('end', () => resolve(true));
          audioStream.on('error', reject);
      });
      
      const fileBuffer = Buffer.concat(chunks);
      tts.close();

      res.json({ audioBase64: fileBuffer.toString('base64') });
    } catch (e: any) {
      console.error("TTS API Error details:", e.message);
      res.status(500).json({ error: "Lỗi tạo giọng đọc. Hệ thống đang tự động thử lại..." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
