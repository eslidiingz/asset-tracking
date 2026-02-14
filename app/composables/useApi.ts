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
        onResponseError({ response }) {
            if (response.status === 401) {
                // จัดการกรณี Token หมดอายุ (Redirect ไป Login หรือ Refresh)
                // authStore.clearAuth()
                // navigateTo('/login')
            }
        }
    })

    return $api
}
