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
    <Dialog v-model:visible="isVisible" :header="form.id ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'" modal
        class="w-full max-w-lg mx-4 md:mx-0" :breakpoints="{ '960px': '75vw', '641px': '95vw' }">
        <Form @submit="onSubmit" class="mt-2">
            <div class="space-y-2">
                <div class="flex flex-col mt-2">
                    <FloatLabel variant="on">
                        <InputText type="text" class="w-full" id="username" name="username" v-model="form.username"
                            required autofocus />
                        <label for="username">ชื่อผู้ใช้งาน</label>
                    </FloatLabel>
                </div>

                <div class="flex flex-col mt-2">
                    <FloatLabel variant="on">
                        <InputText type="password" class="w-full" id="password" name="password" v-model="form.password"
                            :required="!form.id" />
                        <label for="password">รหัสผ่าน</label>
                    </FloatLabel>
                </div>

                <div class="flex items-center">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="form.is_active" inputId="isActive" name="isActive" binary :trueValue="1"
                            :falseValue="0" />
                        <label for="isActive"> เปิดใช้งานบัญชี </label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col justify-between gap-3 mt-4">
                <Button type="submit" :loading="isLoading">
                    <Icon name="lucide:save" />
                    <span>{{ form.id ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้' }}</span>
                </Button>
                <Button type="button" label="ยกเลิก" severity="secondary" @click="onCloseModal" />
            </div>
        </Form>
    </Dialog>
</template>
