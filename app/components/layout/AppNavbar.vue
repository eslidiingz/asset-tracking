<script setup lang="ts">
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()

const handleLogout = async () => {
    await authStore.clearAuth()
    router.push('/login')
}
</script>

<template>
    <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="lucide:trending-up" class="text-white w-5 h-5" />
                </div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Asset Tracking
                </h1>
            </div>

            <div class="flex items-center gap-4">
                <div v-if="user" class="hidden sm:flex flex-col items-end">
                    <span class="text-sm font-medium text-white">{{ user.username }}</span>
                    <span class="text-xs text-gray-500 uppercase tracking-wider">Investor</span>
                </div>

                <Button @click="handleLogout" severity="secondary" variant="text"
                    class="!text-gray-400 hover:!text-white !p-2">
                    <template #icon>
                        <Icon name="lucide:log-out" class="w-5 h-5" />
                    </template>
                </Button>
            </div>
        </div>
    </header>
</template>
