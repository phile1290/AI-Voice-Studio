import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    const validCodesStr = process.env.VALID_ACTIVATION_CODES || 'ADMIN123';
    // Example: VALID_ACTIVATION_CODES="VIP2024:2024-01-01,TRIAL,MA-MOI:2026-06-17"
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

    // Sign a JWT valid for 1 year (365 days)
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    
    const token = jwt.sign(
        { role: 'premium_user', activatedAt: new Date().toISOString() },
        jwtSecret,
        { expiresIn: '365d' }
    );

    return res.status(200).json({ 
        success: true, 
        token, 
        message: 'Kích hoạt thành công. Bạn có thời hạn sử dụng 1 năm.' 
    });

  } catch (e: any) {
    console.error("Activation API Error details:", e.message);
    return res.status(500).json({ error: "Lỗi hệ thống khi xác thực mã." });
  }
}
