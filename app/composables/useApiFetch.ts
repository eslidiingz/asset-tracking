export const useApiFetch: typeof useFetch = (url, options = {}) => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    return useFetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {})
        }
    })
}
