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
        onResponseError({ response }) {
            if (response.status === 401) {
                // Option: deal with unauthorized
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})
