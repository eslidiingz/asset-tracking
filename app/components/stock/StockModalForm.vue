<script setup lang="ts">
const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps({
    portId: {
        type: Number,
        required: true
    },
    remainingRatio: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['close'])

// Stores
const stockStore = useStockStore()

// Composables
const toast = useToast();
const { isEditMode, form, isLoading, createStock, updateStock } = useStock()

// Computed
const header = computed(() => `${isEditMode.value ? 'แก้ไข' : 'เพิ่ม'}หุ้น`)

// Methods
const onSubmit = async () => {
    let payload = {
        ...form,
        port_id: Number(props.portId)
    }

    let response;

    if (isEditMode.value) {
        payload = { ...payload, id: form.id }
        response = await updateStock(payload as any)
    } else {
        response = await createStock(payload as any)
    }

    if (response?.success) {
        toast.add({ severity: 'success', summary: 'Success', detail: `${isEditMode.value ? 'Stock has been updated' : 'Stock has been created'}`, life: 3000 });
        await stockStore.fetchAssets()
        emit('close');
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.statusMessage || response?.message || 'Failed to save stock',
            life: 5000
        });
    }
}

const onRatioInput = () => {
    if (form.ratio && form.ratio > 100) form.ratio = 100
    if (form.ratio && form.ratio < 0) form.ratio = 0
}
</script>

<template>
    <div class="card flex justify-center">
        <Dialog class="w-full max-w-md mx-4" v-model:visible="visible" modal :header @hide="$emit('close')">
            <Form @submit="onSubmit" class="flex flex-col gap-2">

                <InputText id="symbol" name="symbol" type="text" placeholder="ตัวอย่าง: NVDA" required
                    v-model="form.symbol" @input="form.symbol = form.symbol?.toUpperCase()" class="w-full" autofocus />

                <InputNumber id="amount" name="amount" placeholder="จำนวนหุ้นที่มี" :minFractionDigits="0"
                    :maxFractionDigits="8" required v-model="form.amount" class="w-full" />

                <InputNumber id="cost" name="cost" placeholder="ราคาต้นทุนเฉลี่ย" :minFractionDigits="0"
                    :maxFractionDigits="8" mode="decimal" required v-model="form.cost" class="w-full" />

                <InputNumber id="ratio" name="ratio" placeholder="สัดส่วนหุ้นเป้าหมาย" suffix="%" :min="0" :max="100"
                    :minFractionDigits="0" :maxFractionDigits="2" mode="decimal" v-model="form.ratio"
                    @input="onRatioInput" class="w-full" />
                <small class="text-xs text-gray-500">สัดส่วนหุ้นคงเหลือ: {{ remainingRatio }}%</small>

                <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <Button type="button" label="ยกเลิก" severity="secondary" text @click="visible = false"
                        class="order-2 sm:order-1 h-12 sm:h-auto" />
                    <Button type="submit" severity="primary" class="px-6" :loading="isLoading">
                        <Icon name="lucide:save" />
                        <span>บันทึก</span>
                    </Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>