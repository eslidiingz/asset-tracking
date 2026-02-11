<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const toast = useToast()
const usernameError = ref(false)
const passwordError = ref(false)

const handleLogin = async () => {
    usernameError.value = !username.value
    passwordError.value = !password.value

    if (usernameError.value || passwordError.value) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please enter username and password',
            life: 3000
        })
        return
    }

    isLoading.value = true
    try {
        const response = await $fetch<{
            success: boolean,
            message: string,
            access_token: string,
            user: { id: number, username: string }
        }>('/api/login', {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value
            }
        })

        if (response.success) {
            // ใช้ AuthStore เพื่อเก็บข้อมูลและ sync ลง localStorage อัตโนมัติ
            const authStore = useAuthStore()
            authStore.setTokens(response.access_token, response.user)

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
                life: 3000
            })
            router.push('/') // Redirect to home or dashboard
        } else {
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: response.message,
                life: 3000
            })
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.statusMessage || 'An unexpected error occurred',
            life: 3000
        })
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div class="w-full max-w-sm">
            <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
                <div class="text-center text-sm font-bold mb-6">
                    Sign in for managing your portfolio
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <div class="space-y-1.5">
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Icon name="lucide:user" class="w-5 h-5 text-gray-500" />
                            </span>
                            <InputText id="username" v-model="username" :invalid="usernameError"
                                class="w-full pl-10 !bg-gray-800/50 !border-gray-700/50 hover:!border-gray-600 focus:!border-primary-500/50 !text-sm !text-white !rounded-lg !py-2.5 transition-colors"
                                placeholder="Enter username" style="padding-left: 2.5rem !important;" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Icon name="lucide:lock" class="w-5 h-5 text-gray-500" />
                            </span>
                            <Password inputId="password" v-model="password" :feedback="false" toggleMask class="w-full"
                                :invalid="passwordError"
                                :inputClass="'w-full pl-10 !bg-gray-800/50 !border-gray-700/50 hover:!border-gray-600 focus:!border-primary-500/50 !text-sm !text-white !rounded-lg !py-2.5 transition-colors'"
                                style="padding-left: 0;" :inputStyle="{ 'padding-left': '2.5rem !important' }"
                                placeholder="Enter password" />
                        </div>
                    </div>

                    <div class="pt-2">
                        <Button type="submit" label="Sign In" :loading="isLoading"
                            class="w-full !bg-primary-600 hover:!bg-primary-500 !border-none !text-white !font-semibold !py-2.5 !rounded-lg shadow-lg shadow-primary-900/20">
                            <template #icon>
                                <Icon name="lucide:log-in" class="w-5 h-5" />
                            </template>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-password) {
    width: 100%;
}

:deep(.p-password-input) {
    width: 100%;
    padding-left: 2.5rem !important;
    /* Force padding left for password input */
}

:deep(.p-icon-field-right > .p-inputtext) {
    padding-right: 2.5rem;
}

:deep(.p-password .p-icon) {
    color: #9ca3af;
    /* text-gray-400 */
}
</style>