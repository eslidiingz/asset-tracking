<script setup lang="ts">
const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits(['update:visible', 'update:users'])

// --- Composables ---
const $user = useUser()
const toast = useToast()
const { createUser, updateUser, form, isLoading } = $user

// --- Computed ---
const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
})

// --- Watchers ---
watch(() => props.visible, (newVisible) => {
    const onEditMode = $user.isEditMode.value === true
    if (newVisible && !onEditMode) {
        $user.resetForm()
    }
})

// --- Handler ---
const onCloseModal = () => {
    isVisible.value = false
}


// --- Methods ---
const onSubmit = async () => {
    try {
        if (form.value.id) {
            await updateUser(form.value)
        } else {
            await createUser(form.value)
        }
        emit('update:users')
        onCloseModal()
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${form.value.id ? 'updated' : 'created'} successfully`,
            life: 3000
        })
    } catch (error: any) {
        if (error.statusCode === 409) {
            toast.add({
                severity: 'warn',
                summary: 'Duplicate Username',
                detail: 'This username is already taken. Please choose another.',
                life: 5000
            })
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.statusMessage || 'An unexpected error occurred',
                life: 5000
            })
        }
    }
}
</script>

<template>
    <Dialog v-model:visible="isVisible" :header="form.id ? 'Edit User' : 'Create User'" modal
        class="w-full max-w-lg mx-4 md:mx-0" :breakpoints="{ '960px': '75vw', '641px': '95vw' }">
        <Form @submit="onSubmit" class="mt-2">
            <div class="space-y-2">
                <div class="flex flex-col">
                    <InputText type="text" id="username" name="username" v-model="form.username"
                        placeholder="Enter username" required autofocus />
                </div>

                <div class="flex flex-col">
                    <InputText type="password" id="password" name="password" v-model="form.password"
                        placeholder="Enter password" :required="!form.id" />
                </div>

                <div class="flex items-center">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="form.is_active" inputId="isActive" name="isActive" binary :trueValue="1"
                            :falseValue="0" />
                        <label for="isActive"> Active Account </label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col justify-between gap-3 mt-4">
                <Button type="submit" :loading="isLoading">
                    <Icon name="lucide:save" />
                    <span>{{ form.id ? 'Update Changes' : 'Create User' }}</span>
                </Button>
                <Button type="button" label="Cancel" severity="secondary" @click="onCloseModal" />
            </div>
        </Form>
    </Dialog>
</template>
