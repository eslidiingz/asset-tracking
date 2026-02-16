export default defineNuxtPlugin(() => {
    const authStore = useAuthStore()

    const api = $fetch.create({
        onRequest({ options }) {
            if (authStore.accessToken) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authStore.accessToken}`
                } as any
            }
        },
        async onResponseError({ response, options, request }) {
            if (response.status === 401) {
                // อย่าทำ refresh ถ้ากำลังเรียก api/refresh หรือ login หรือ logout อยู่แล้ว
                const url = request.toString()
                const isAuthPath = url.includes('/api/refresh') ||
                    url.includes('/api/login') ||
                    url.includes('/api/logout')

                if (isAuthPath) return

                // พยายาม Refresh เฉพาะเมื่อเรามี Token เดิมอยู่ (แปลว่าหมดอายุ)
                // ถ้าไม่มี Token เลย แปลว่ายังไม่ได้ Login จึงไม่ควรทำ Refresh
                if (!authStore.accessToken) {
                    await authStore.clearAuth()
                    navigateTo('/login')
                    return
                }

                const newToken = await authStore.refreshToken()
                if (!newToken) {
                    await authStore.clearAuth()
                    navigateTo('/login')
                }
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})
