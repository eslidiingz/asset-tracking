export default defineEventHandler((event) => {
    // ลบ Refresh Token Cookie โดยการตั้งค่าให้หมดอายุทันที
    deleteCookie(event, 'asset-tracking-refresh-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return {
        success: true,
        message: "Logged out successfully"
    }
})
