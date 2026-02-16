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

const toast = useToast();
const _stock = useStock()
const { isEditMode, form, addStock, updateStock } = _stock

const header = computed(() => `${isEditMode.value ? 'Edit' : 'Add'} Stock`)

const onSubmit = async () => {
    const payload = {
        ...form,
        port_id: Number(props.portId)
    }

    let response;

    if (isEditMode.value) {
        response = await updateStock(payload as any)
    } else {
        response = await addStock(payload as any)
    }

    if (response?.success) {
        visible.value = false;
        emit('close');
        toast.add({ severity: 'success', summary: 'Success', detail: 'Stock saved successfully', life: 3000 });
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

                <InputText id="symbol" name="symbol" type="text" placeholder="e.g. NVDA" required v-model="form.symbol"
                    @input="form.symbol = form.symbol?.toUpperCase()" class="w-full" />

                <InputNumber id="amount" name="amount" placeholder="Quantity owned" :minFractionDigits="0"
                    :maxFractionDigits="8" required v-model="form.amount" class="w-full" />

                <InputNumber id="cost" name="cost" placeholder="Average purchase price" :minFractionDigits="0"
                    :maxFractionDigits="8" mode="decimal" required v-model="form.cost" class="w-full" />

                <InputNumber id="ratio" name="ratio" placeholder="Target portfolio percentage" suffix="%" :min="0"
                    :max="100" :minFractionDigits="0" :maxFractionDigits="2" mode="decimal" v-model="form.ratio"
                    @input="onRatioInput" class="w-full" />
                <small class="text-xs text-gray-500">Remaining capacity: {{ remainingRatio }}%</small>

                <div class="flex justify-between gap-3 mt-4">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="submit" severity="primary" class="px-6">
                        <Icon name="lucide:save" />
                        <span>Save</span>
                    </Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>