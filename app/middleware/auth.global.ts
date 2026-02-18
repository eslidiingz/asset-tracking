export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()

    // ไม่ต้องเช็คถ้าอยู่ในหน้า login หรือ auth paths
    if (to.path === '/login') return

    // ถ้าไม่มี Access Token แต่ผู้ใช้กำลังจะเข้าหน้าที่ต้องใช้ Auth
    if (!authStore.accessToken) {
        // ลองพยายาม refresh ดูก่อนว่ามี session ค้างใน HttpOnly cookie ไหม
        const newToken = await authStore.refreshToken()
        if (!newToken) {
            return navigateTo('/login')
        }
    }
})
