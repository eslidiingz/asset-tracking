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

const onNumericInput = (event: any, field: 'ratio', maxFractionDigits: number = 8) => {
    let value = handleNumericInput(event.target.value, maxFractionDigits);

    // Range validation for ratio
    if (field === 'ratio') {
        const num = parseFloat(value);
        if (num > 100) value = "100";
    }

    (form as any)[field] = value;
}

const onSubmit = async () => {
    if (props.port?.id) {
        form.asset_id = Number(props.assetId)
        form.ratio = Number(form.ratio || 0)
        await updatePort(props.port.id)
    } else {
        form.ratio = Number(form.ratio || 0)
        await createPort(props.assetId)
    }
    emit('update:ports')
    onCloseModal()
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :header="port ? 'แก้ไขพอร์ต' : 'เพิ่มพอร์ต'"
        class="w-full max-w-lg mx-2 md:mx-0" :breakpoints="{ '960px': '75vw', '641px': '95vw' }" @hide="onCloseModal">
        <Form @submit="onSubmit" class="mt-2">
            <div class="space-y-2 mb-6">
                <div class="flex flex-col gap-1.5">
                    <FloatLabel variant="on">
                        <InputText id="name" name="name" type="text"
                            placeholder="ตัวอย่าง: หุ้นเติบโต, หุ้นเสี่ยงสูง, หุ้นปันผล" required v-model="form.name"
                            class="w-full h-12" autofocus />
                        <label for="name">ชื่อพอร์ต</label>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-1.5">
                    <FloatLabel variant="on">
                        <InputText id="description" name="description" v-model="form.description" class="w-full h-12" />
                        <label for="description">รายละเอียด (ไม่จำเป็น)</label>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-1.5">
                    <InputGroup>
                        <FloatLabel variant="on">
                            <InputText v-model="form.ratio" id="ratio" name="ratio" inputmode="decimal"
                                @input="onNumericInput($event, 'ratio', 2)" class="w-full h-12" />
                            <label for="ratio">สัดส่วนเป้าหมาย %</label>
                        </FloatLabel>
                        <InputGroupAddon>%</InputGroupAddon>
                    </InputGroup>
                    <div class="flex justify-between items-center px-1">
                        <small class="text-xs text-gray-500">สัดส่วนพอร์ตที่เหลือ: {{ (100 - remainingRatio).toFixed(2)
                            }}%</small>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <Button type="button" label="ยกเลิก" severity="secondary" text @click="onCloseModal"
                    class="order-2 sm:order-1 h-12 sm:h-auto" />
                <Button type="submit" :loading="isLoading" class="order-1 sm:order-2 h-12 px-8">
                    <Icon name="lucide:save" />
                    <span>{{ port ? 'แก้ไขพอร์ต' : 'เพิ่มพอร์ต' }}</span>
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