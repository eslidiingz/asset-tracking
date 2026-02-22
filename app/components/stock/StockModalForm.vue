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
        port_id: Number(props.portId),
        amount: Number(form.amount || 0),
        cost: Number(form.cost || 0),
        ratio: Number(form.ratio || 0)
    } as any

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

const onNumericInput = (event: any, field: 'amount' | 'cost' | 'ratio', maxFractionDigits: number = 8) => {
    let value = handleNumericInput(event.target.value, maxFractionDigits);

    // Range validation for ratio
    if (field === 'ratio') {
        const num = parseFloat(value);
        if (num > 100) value = "100";
    }

    (form as any)[field] = value;
}
</script>

<template>
    <div class="card flex justify-center">
        <Dialog class="w-full max-w-md mx-4" v-model:visible="visible" modal :header @hide="$emit('close')">
            <Form @submit="onSubmit" class="flex flex-col gap-2">

                <InputText id="symbol" name="symbol" type="text" placeholder="ตัวอย่าง: NVDA" required
                    v-model="form.symbol" @input="form.symbol = form.symbol?.toUpperCase()" class="w-full" autofocus />

                <InputText id="amount" name="amount" placeholder="จำนวนหุ้นที่มี" inputmode="decimal" required
                    v-model="form.amount" @input="onNumericInput($event, 'amount', 8)" class="w-full" />

                <InputText id="cost" name="cost" placeholder="ราคาต้นทุนเฉลี่ย" inputmode="decimal" required
                    v-model="form.cost" @input="onNumericInput($event, 'cost', 8)" class="w-full" />

                <div class="flex flex-col gap-1 w-full">
                    <InputGroup>
                        <InputText id="ratio" name="ratio" placeholder="สัดส่วนหุ้นเป้าหมาย" inputmode="decimal"
                            v-model="form.ratio" @input="onNumericInput($event, 'ratio', 2)" class="w-full" />
                        <InputGroupAddon>%</InputGroupAddon>
                    </InputGroup>
                </div>
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

<style scoped>
:deep(.p-inputtext),
:deep(.p-inputnumber-input) {
    font-size: 1rem;
    /* Prevent zoom on iOS */
}
</style>