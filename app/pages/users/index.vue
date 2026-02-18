<script setup lang="ts">
import type { User } from '~/interfaces/user.interface'

// --- Composables ---
const $user = useUser()
const { isLoading, users, fetchUsers, deleteUser } = $user
await fetchUsers()

const { requireDelete } = useAppConfirm()

// --- State Management ---
const isDialogVisible = ref(false)
const searchQuery = ref('')
const selectedUser = ref<Partial<User>>()
const isSubmitting = ref(false)

// --- Computed ---
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value
    const q = searchQuery.value.toLowerCase()
    return users.value.filter(u => u.username.toLowerCase().includes(q))
})

// --- Handlers ---
const openNew = () => {
    $user.resetForm()
    selectedUser.value = { username: '', role: 'USER', is_active: 1 }
    isDialogVisible.value = true
}

const editUser = (user: User) => {
    $user.setForm(user)
    selectedUser.value = { ...user }
    isDialogVisible.value = true
}

const onUpdateUsers = async () => {
    await fetchUsers()
    isDialogVisible.value = false
}

const onDeleteUser = async (user: User) => {
    requireDelete(async () => {
        await deleteUser(user.id)
        await fetchUsers()
    }, `User has been deleted`)
}
</script>

<template>
    <div class="max-w-6xl mx-auto space-y-2">
        <h2 class="text-2xl font-bold text-white mb-4">Users Management</h2>

        <Card>
            <template #content>
                <div class="grid grid-cols-4 font-bold">
                    <div class="col-span-2">
                        USERNAME
                    </div>

                    <div class="justify-self-center">
                        ROLE
                    </div>

                    <div class="justify-self-end">
                        ACTION
                    </div>
                </div>
            </template>
        </Card>

        <div v-for="user in users" :key="user.id">
            <Card>
                <template #content>
                    <div class="grid grid-cols-4">
                        <div class="col-span-2">
                            {{ user.is_active ? '✅' : '❌' }} {{ user.username }}
                        </div>

                        <div class="justify-self-center">
                            {{ user.role }}
                        </div>

                        <div class="flex items-center justify-self-end gap-x-2">
                            <button @click.stop.prevent="editUser(user)"
                                class="text-gray-500 hover:text-yellow-400 transition-colors flex items-center justify-center outline-none"
                                title="Edit User">
                                <Icon name="lucide:edit" class="text-xl" />
                            </button>
                            <button @click.stop.prevent="onDeleteUser(user)"
                                class="text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center outline-none"
                                title="Delete User">
                                <Icon name="lucide:trash-2" class="text-xl" />
                            </button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <UiButtonFloat @click="openNew" />
    <UserModalForm v-model:visible="isDialogVisible" :user="selectedUser" :loading="isSubmitting"
        @update:users="onUpdateUsers" />
</template>

<style scoped>
/* Simplified styles, removing complex overrides */
:deep(.p-datatable-thead > tr > th) {
    background-color: #111827;
    /* gray-900 */
    color: #9ca3af;
    border-bottom: 1px solid #1f2937;
    font-size: 0.875rem;
}

:deep(.p-datatable-tbody > tr) {
    background-color: transparent;
    color: #f3f4f6;
    border-bottom: 1px solid #1f2937;
}

:deep(.p-datatable-loading-overlay) {
    background-color: rgba(17, 24, 39, 0.7);
}
</style>