import express from "express";
import path from "path";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import axios from "axios";
import jwt from "jsonwebtoken";

// Memory storage for audio uploads
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // Custom auth endpoint
  app.post("/api/activate", async (req, res) => {
    try {
      const { code } = req.body;
      const validCodesStr = process.env.VALID_ACTIVATION_CODES || 'ADMIN123';
      const rawCodes = validCodesStr.split(',').map(c => c.trim());
      
      let isValidCode = false;
      let isExpired = false;

      for (const raw of rawCodes) {
         const parts = raw.split(':');
         const envCode = parts[0].toLowerCase();
         
         if (code && envCode === code.toLowerCase()) {
            isValidCode = true;
            
            if (parts.length > 1) {
               const createdDate = new Date(parts[1]);
               if (!isNaN(createdDate.getTime())) {
                  const now = new Date();
                  const diffTime = now.getTime() - createdDate.getTime();
                  const diffDays = diffTime / (1000 * 60 * 60 * 24); 
                  
                  if (diffDays >= 365) {
                     isExpired = true;
                  }
               }
            }
            break;
         }
      }

      if (!isValidCode) {
          return res.status(401).json({ error: 'Mã kích hoạt không đúng hoặc không tồn tại.' });
      }
      
      if (isExpired) {
          return res.status(401).json({ error: 'Mã kích hoạt này đã quá hạn sử dụng 1 năm.' });
      }

      const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
      const token = jwt.sign(
          { role: 'premium_user', activatedAt: new Date().toISOString() },
          jwtSecret,
          { expiresIn: '365d' }
      );

      res.status(200).json({ 
          success: true, 
          token, 
          message: 'Kích hoạt thành công. Bạn có thời hạn sử dụng 1 năm.' 
      });
    } catch (e: any) {
      console.error("Activation API Error details:", e.message);
      res.status(500).json({ error: "Lỗi hệ thống khi xác thực mã." });
    }
  });

  // Proxy TTS endpoint (Upgraded to Edge TTS for unlimited, free usage without API keys)
  app.post("/api/gemini/tts", async (req, res) => {
    // --- Auth Verification ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Bạn cần nhập mã kích hoạt để sử dụng chức năng này.' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';

    try {
      jwt.verify(token, jwtSecret);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Mã của bạn đã hết hạn (1 năm). Vui lòng mua mã mới.' });
      }
      return res.status(401).json({ error: 'Mã không hợp lệ hoặc đã bị thay đổi.' });
    }
    // -------------------------

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
