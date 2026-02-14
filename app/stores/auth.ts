import { defineStore } from 'pinia'

interface User {
    id: number
    username: string
}

export const useAuthStore = defineStore('auth', () => {
    // ใช้ useCookie เพื่อให้ Server-side มองเห็นสถานะการ Login ด้วย
    const accessToken = useCookie<string | null>('asset-tracking-access-token', {
        maxAge: 60 * 15, // 15 นาที ตามอายุ Access Token
        sameSite: 'lax'
    })

    const user = useCookie<User | null>('asset-tracking-user', {
        maxAge: 60 * 60 * 24 * 7, // 7 วัน
        sameSite: 'lax'
    })

    const setTokens = (token: string, userData: User) => {
        accessToken.value = token
        user.value = userData
    }

    const clearAuth = async () => {
        const { $api } = useNuxtApp()
        try {
            // เรียก API เพื่อลบ Refresh Token Cookie ใน Server อย่างเดียว
            await $api('/api/logout', { method: 'POST' })
        } catch (error) {
            console.error('Logout API failed', error)
        } finally {
            // ลบ Cookie ฝั่ง Client
            accessToken.value = null
            user.value = null
        }
    }

    const isAuthenticated = computed(() => !!accessToken.value)

    return {
        accessToken,
        user,
        setTokens,
        clearAuth,
        isAuthenticated
    }
})
