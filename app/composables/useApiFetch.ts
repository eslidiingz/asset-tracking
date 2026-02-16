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
            if (response.status === 401) {
                const newToken = await authStore.refreshToken()
                if (!newToken) {
                    await authStore.clearAuth()
                    navigateTo('/login')
                }
            }
        }
    })
}
