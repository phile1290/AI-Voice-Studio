import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ audioBase64: fileBuffer.toString('base64') });
  } catch (e: any) {
    console.error("TTS API Error details:", e.message);
    res.status(500).json({ error: "Lỗi tạo giọng đọc. Hệ thống đang tự động thử lại..." });
  }
}
