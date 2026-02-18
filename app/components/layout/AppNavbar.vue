<script setup lang="ts">
// Router
const router = useRouter()

// Stores
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { fetchAssets } = useStockStore();
await fetchAssets();

// Composables
const { requireConfirm } = useAppConfirm()

// States
const visible = ref<boolean>(false);

// Methods
const onLogout = async () => {
    requireConfirm({
        message: 'Are you sure you want to logout?',
        onAccept: async () => {
            await authStore.clearAuth()
            router.push('/login')
        },
        successDetail: 'Logged out successfully'
    })
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
                <Button v-if="user?.role === 'ADMIN'" severity="secondary" variant="text"
                    class="!text-gray-400 hover:!text-white !p-2">
                    <template #icon>
                        <Icon name="lucide:menu" class="w-5 h-5" @click="visible = true" />
                    </template>
                </Button>

                <Button v-else @click="onLogout" severity="secondary" variant="text"
                    class="!text-gray-400 hover:!text-white !p-2">
                    <template #icon>
                        <Icon name="lucide:log-out" class="w-5 h-5" />
                    </template>
                </Button>
            </div>

            <Drawer v-if="user?.role === 'ADMIN'" v-model:visible="visible" header="Menu" position="right">
                <ul class="list-none p-0 m-0 overflow-hidden">
                    <li>
                        <a v-ripple
                            class="flex items-center cursor-pointer p-4 rounded hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors">
                            <i class="pi pi-users mr-2"></i>
                            <span class="font-medium">Users</span>
                        </a>
                    </li>
                    <li>
                        <a v-ripple @click="onLogout"
                            class="flex items-center cursor-pointer p-4 rounded hover:bg-surface-100 dark:text-red-500 dark:hover:bg-surface-800 duration-150 transition-colors">
                            <i class="pi pi-sign-out mr-2"></i>
                            <span class="font-medium">Logout</span>
                        </a>
                    </li>
                </ul>
            </Drawer>
        </div>
    </header>
</template>