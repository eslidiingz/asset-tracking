<script setup lang="ts">
const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits(['close', 'update:assets'])

const { form, createAsset, resetForm, isLoading } = useAsset()

const remainingRatio = 0

const onCloseModal = () => {
    emit('close')
    resetForm()
}

const onSubmit = async () => {
    await createAsset()
    emit('update:assets')
    onCloseModal()
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Add Asset" class="w-full max-w-md mx-4" @hide="onCloseModal">
        <Form @submit="onSubmit">
            <div class="mb-6">
                <div class="flex flex-col mb-2">
                    <InputText name="name" type="text" placeholder="Name" required v-model="form.name" />
                </div>
                <div class="flex flex-col mb-2">
                    <InputText name="description" type="text" placeholder="Description" v-model="form.description" />
                </div>
                <div class="flex flex-col mb-2">
                    <InputNumber v-model="form.ratio" id="ratio" name="ratio" placeholder="Target ratio" suffix="%"
                        :min="0" :max="100" :minFractionDigits="0" :maxFractionDigits="2" mode="decimal" />

                    <small class="text-xs text-gray-600 my-1">Remaining ratio: {{ remainingRatio }}%</small>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="onCloseModal"></Button>
                <Button type="submit" :loading="isLoading">
                    <Icon name="lucide:save" />
                    <span>Save</span>
                </Button>
            </div>
        </Form>
    </Dialog>
</template>