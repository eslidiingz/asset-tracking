import { defineStore } from 'pinia'

interface User {
    id: number
    username: string
}

export const useAuthStore = defineStore('auth', () => {
    // ใช้ useCookie เพื่อให้ Server-side มองเห็นสถานะการ Login ด้วย
    // เพิ่ม maxAge เป็น 7 วัน เพื่อให้สามารถทำ Silent Refresh ได้โดยหน้าเว็บไม่เด้งออกไป Login ก่อน
    const accessToken = useCookie<string | null>('asset-tracking-access-token', {
        maxAge: 60 * 60 * 24 * 7, // 7 วัน (ตามอายุ Refresh Token)
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
        try {
            // เรียก API เพื่อลบ Refresh Token Cookie ใน Server 
            // ใช้ $fetch แทน $api เพื่อเลี่ยงปัญหา useNuxtApp() ใน SSR context
            await $fetch('/api/logout', { method: 'POST' })
        } catch (error) {
            // คาดหวังว่าอาจจะ fail ได้ถ้าไม่ได้ login อยู่แล้ว
        } finally {
            // ลบ Cookie ฝั่ง Client
            accessToken.value = null
            user.value = null
        }
    }

    // ฟังก์ชันสำหรับ Refresh Token
    let refreshPromise: Promise<string | null> | null = null
    const refreshToken = async (): Promise<string | null> => {
        if (refreshPromise) return refreshPromise

        refreshPromise = (async () => {
            try {
                const response = await $fetch<{ success: boolean, access_token: string }>('/api/refresh', {
                    method: 'POST'
                })

                if (response.success && response.access_token) {
                    accessToken.value = response.access_token
                    return response.access_token
                }
                return null
            } catch (error) {
                console.error('Refresh token failed:', error)
                return null
            } finally {
                refreshPromise = null
            }
        })()

        return refreshPromise
    }

    const isAuthenticated = computed(() => !!accessToken.value)

    return {
        accessToken,
        user,
        setTokens,
        clearAuth,
        refreshToken,
        isAuthenticated
    }
})
