import type { User } from "~/interfaces/user.interface"

export const useUser = () => {
    const { $api } = useNuxtApp();

    const users = ref<User[]>([])
    const isLoading = ref(false)
    const form = reactive<Partial<User>>({
        username: '',
        password: '',
        is_active: 1,
        role: 'USER'
    })

    const fetchUsers = async () => {
        isLoading.value = true
        try {
            const response = await $fetch('/api/users')
            users.value = (response as any).data as User[]
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            isLoading.value = false
        }
    }

    const setForm = (user: Partial<User>) => {
        Object.assign(form, {
            id: user.id || undefined,
            username: user.username || '',
            password: '', // Clear password field for security/edit
            is_active: user.is_active ?? 1,
            role: user.role || 'USER'
        })
    }

    const resetForm = () => {
        Object.assign(form, {
            id: undefined,
            username: '',
            password: '',
            is_active: 1,
            role: 'USER'
        })
    }

    const createUser = async (userData: Partial<User>) => {
        isLoading.value = true
        try {
            const response = await $api('/api/users', {
                method: 'POST',
                body: userData
            })
            const newUser = (response as any).data as User
            if (newUser) {
                users.value.push(newUser)
            }
            return response
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (userData: Partial<User>) => {
        isLoading.value = true
        try {
            const response = await $api(`/api/users/${userData.id}`, {
                method: 'PUT',
                body: userData
            })
            const updatedUser = (response as any).data as User
            const index = users.value.findIndex((u) => u.id === userData.id)
            if (index !== -1 && updatedUser) {
                users.value[index] = updatedUser
            }
            return response
        } catch (error) {
            console.error('Error updating user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (id: number) => {
        isLoading.value = true
        try {
            await $api(`/api/users/${id}`, {
                method: 'DELETE'
            })
            users.value = users.value.filter((u) => u.id !== id)
        } catch (error) {
            console.error('Error deleting user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        users,
        isLoading,
        form,

        fetchUsers,
        setForm,
        resetForm,
        createUser,
        updateUser,
        deleteUser
    }
}