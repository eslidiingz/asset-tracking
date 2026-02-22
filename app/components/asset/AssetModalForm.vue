<script setup lang="ts">
import type { Asset } from '~/interfaces/asset.interface';

const props = defineProps({
    asset: {
        type: Object as PropType<Asset | null>,
        default: null
    }
})

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits(['close', 'update:assets'])

const { form, createAsset, updateAsset, resetForm, setForm, isLoading } = useAsset()

const remainingRatio = 0

watch(() => props.asset, (newAsset) => {
    if (newAsset) {
        setForm(newAsset)
    } else {
        resetForm()
    }
}, { immediate: true })

const onCloseModal = () => {
    emit('close')
    resetForm()
}

const onSubmit = async () => {
    const assetId = props.asset?.id
    if (assetId) {
        await updateAsset(assetId)
    } else {
        await createAsset()
    }
    emit('update:assets')
    onCloseModal()
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :header="asset ? 'แก้ไขสินทรัพย์' : 'เพิ่มสินทรัพย์'"
        class="w-full max-w-lg mx-2 md:mx-0" :breakpoints="{ '960px': '75vw', '641px': '95vw' }" @hide="onCloseModal">
        <Form @submit="onSubmit" class="mt-2">
            <div class="space-y-2 mb-6">
                <div class="flex flex-col gap-1.5">
                    <InputText id="name" name="name" type="text" placeholder="ตัวอย่าง: Crypto, US Stocks, Gold"
                        required v-model="form.name" class="w-full h-12" autofocus />
                </div>

                <div class="flex flex-col gap-1.5">
                    <InputText id="description" name="description" placeholder="คำอธิบาย (ไม่จำเป็น)"
                        v-model="form.description" class="w-full h-12" />
                </div>

                <div class="flex flex-col gap-1.5">
                    <InputNumber v-model="form.ratio" id="ratio" name="ratio" placeholder="สัดส่วนเป้าหมาย %" suffix="%"
                        :min="0" :max="100" :minFractionDigits="0" :maxFractionDigits="2" mode="decimal"
                        class="w-full h-12" />
                    <div class="flex justify-between items-center px-1">
                        <small class="text-xs text-gray-500">สัดส่วนคงเหลือ: {{ (100 - remainingRatio).toFixed(2)
                            }}%</small>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <Button type="button" label="ยกเลิก" severity="secondary" text @click="onCloseModal"
                    class="order-2 sm:order-1 h-12 sm:h-auto" />
                <Button type="submit" :loading="isLoading" class="order-1 sm:order-2 h-12 px-8">
                    <Icon name="lucide:save" />
                    <span>{{ asset ? 'แก้ไขสินทรัพย์' : 'เพิ่มสินทรัพย์' }}</span>
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