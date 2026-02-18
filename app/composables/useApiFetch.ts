export const useApiFetch: typeof useFetch = (url, options = {}) => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    return useFetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {})
        },
        async onResponseError({ response }) {
            const nuxtApp = useNuxtApp()
            if (response.status === 401) {
                if (!authStore.accessToken) {
                    await authStore.clearAuth()
                    return nuxtApp.runWithContext(() => navigateTo('/login'))
                }
                const newToken = await authStore.refreshToken()
                if (newToken) {
                    return $fetch(url, {
                        ...options,
                        headers: {
                            ...options?.headers,
                            Authorization: `Bearer ${newToken}`
                        }
                    })
                } else {
                    await authStore.clearAuth()
                    return nuxtApp.runWithContext(() => navigateTo('/login'))
                }
            }
        }
    })
}
