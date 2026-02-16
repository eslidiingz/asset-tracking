import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    // 1. อ่าน Refresh Token จาก Cookie
    const refreshToken = getCookie(event, 'asset-tracking-refresh-token');

    if (!refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: "Refresh token missing",
        });
    }

    try {
        // 2. ตรวจสอบความถูกต้องของ Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number };

        // 3. ดึงข้อมูล User (แบบย่อ) เพื่อสร้าง Access Token ใหม่
        // หมายเหตุ: ในระบบจริงควรเช็ค DB ว่า User ยังมีตัวตนอยู่หรือไม่
        const userCredential = {
            id: decoded.id,
            // ข้อมูล username อาจจะเก็บไว้ใน Refresh Token หรือดึงใหม่จาก DB
            // เพื่อความง่ายที่นี่เราเก็บแค่ ID หรือจะไปดึง DB เพิ่มก็ได้
        };

        // 4. สร้าง Access Token ใหม่ (1 ชั่วโมง)
        const accessToken = jwt.sign(
            userCredential,
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            access_token: accessToken
        };
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid refresh token",
        });
    }
});
