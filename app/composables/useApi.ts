export const useApi = () => {
    const authStore = useAuthStore()

    const $api = $fetch.create({
        onRequest({ options }) {
            if (authStore.accessToken) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authStore.accessToken}`
                } as any
            }
        },
        async onResponseError({ response, options, request }) {
            const nuxtApp = useNuxtApp()
            if (response.status === 401) {
                // อย่าทำ refresh ถ้ากำลังเรียก api/refresh หรือ login หรือ logout อยู่แล้ว
                const url = request.toString()
                const isAuthPath = url.includes('/api/refresh') ||
                    url.includes('/api/login') ||
                    url.includes('/api/logout')

                if (isAuthPath) return

                // พยายาม Refresh เฉพาะเมื่อเรามี Token เดิมอยู่ (แปลว่าหมดอายุ)
                if (!authStore.accessToken) {
                    await authStore.clearAuth()
                    return nuxtApp.runWithContext(() => navigateTo('/login'))
                }

                // พยายาม Refresh Token
                const newToken = await authStore.refreshToken()

                if (newToken) {
                    // ถ้า refresh สำเร็จ ให้บันทึก token และอาจจะบอกให้ user ลองกดใหม่อีกครั้ง 
                    // หรือในอุดมคติคือการ retry request นี้เลย
                    // หมายเหตุ: ofetch .create() ไม่รองรับการ retry อัตโนมัติจาก onResponseError ได้ง่ายๆ
                    // แต่การเรียกครั้งถัดไปจะใช้ Token ใหม่แล้ว
                } else {
                    // ถ้า refresh ไม่สำเร็จ หรือ Refresh Token หมดอายุ
                    await authStore.clearAuth()
                    return nuxtApp.runWithContext(() => navigateTo('/login'))
                }
            }
        }
    })

    return $api
}
