<script setup lang="ts">
import type { Port } from '~/interfaces/port.interface';

const props = defineProps({
    port: {
        type: Object as PropType<Port | null>,
        default: null
    },
    assetId: {
        type: [String, Number],
        required: true
    }
})

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits(['close', 'update:ports'])

const { form, createPort, updatePort, resetForm, setForm, isLoading } = usePort()

const remainingRatio = 0 // In real scenario, this should be calculated

watch(() => props.port, (newPort) => {
    if (newPort) {
        setForm(newPort)
    } else {
        resetForm()
    }
}, { immediate: true })

const onCloseModal = () => {
    emit('close')
    visible.value = false
    resetForm()
}

const onSubmit = async () => {
    if (props.port?.id) {
        form.asset_id = Number(props.assetId)
        await updatePort(props.port.id)
    } else {
        await createPort(props.assetId)
    }
    emit('update:ports')
    onCloseModal()
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :header="port ? 'Edit Port' : 'Add Port'"
        class="w-full max-w-lg mx-2 md:mx-0" :breakpoints="{ '960px': '75vw', '641px': '95vw' }" @hide="onCloseModal">
        <Form @submit="onSubmit" class="mt-2">
            <div class="space-y-2 mb-6">
                <div class="flex flex-col gap-1.5">
                    <InputText id="name" name="name" type="text" placeholder="e.g. Technology, Dividend, Crypto"
                        required v-model="form.name" class="w-full h-12" autofocus />
                </div>

                <div class="flex flex-col gap-1.5">
                    <InputText id="description" name="description" placeholder="Description (optional)"
                        v-model="form.description" class="w-full h-12" />
                </div>

                <div class="flex flex-col gap-1.5">
                    <InputNumber v-model="form.ratio" id="ratio" name="ratio" placeholder="Ratio %" suffix="%" :min="0"
                        :max="100" :minFractionDigits="0" :maxFractionDigits="2" mode="decimal" class="w-full h-12" />
                    <div class="flex justify-between items-center px-1">
                        <small class="text-xs text-gray-500">Remaining to allocate: {{ (100 - remainingRatio).toFixed(2)
                        }}%</small>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <Button type="button" label="Cancel" severity="secondary" text @click="onCloseModal"
                    class="order-2 sm:order-1 h-12 sm:h-auto" />
                <Button type="submit" :loading="isLoading" class="order-1 sm:order-2 h-12 px-8">
                    <Icon name="lucide:save" />
                    <span>{{ port ? 'Update Changes' : 'Create Port' }}</span>
                </Button>
            </div>
        </Form>
    </Dialog>
</template>

<style scoped>
:deep(.p-dialog-header) {
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

:deep(.p-dialog-content) {
    padding: 0 1.5rem 1.5rem 1.5rem;
}

:deep(.p-inputtext),
:deep(.p-inputnumber-input) {
    font-size: 1rem;
    /* Prevent zoom on iOS */
}
</style>