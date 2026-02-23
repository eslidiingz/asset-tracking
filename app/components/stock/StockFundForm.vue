<script setup lang="ts">

// --- Composables ---
const { isEditMode, form, isLoading, createStock, updateStock } = useStock()

// --- Methods ---
const onNumericInput = (event: any, field: 'amount' | 'cost' | 'ratio' | 'value' | 'total_cost' | 'price', maxFractionDigits: number = 8) => {
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
    <InputText id="symbol" name="symbol" type="text" placeholder="ตัวอย่าง: SCBNDQ(A)" required v-model="form.symbol"
        class="w-full" autofocus />

    <InputText id="amount" name="amount" placeholder="จำนวนหน่วยที่มี" inputmode="decimal" required
        v-model="form.amount" @input="onNumericInput($event, 'amount', 8)" class="w-full" />

    <InputText id="cost" name="cost" placeholder="ราคาต้นทุนเฉลี่ย" inputmode="decimal" required v-model="form.cost"
        @input="onNumericInput($event, 'cost', 8)" class="w-full" />

    <InputText id="total_cost" name="total_cost" placeholder="ราคาต้นทุนรวม" inputmode="decimal" required
        v-model="form.total_cost" @input="onNumericInput($event, 'total_cost', 8)" class="w-full" />

    <InputText id="price" name="price" placeholder="ราคาปัจจุบัน" inputmode="decimal" required v-model="form.price"
        @input="onNumericInput($event, 'price', 8)" class="w-full" />

    <InputText id="value" name="value" placeholder="มูลค่าปัจจุบัน" inputmode="decimal" required v-model="form.value"
        @input="onNumericInput($event, 'value', 8)" class="w-full" />

    <div class="flex flex-col gap-1 w-full">
        <InputGroup>
            <InputText id="ratio" name="ratio" placeholder="สัดส่วนหุ้นเป้าหมาย" inputmode="decimal"
                v-model="form.ratio" @input="onNumericInput($event, 'ratio', 2)" class="w-full" />
            <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>
    </div>
</template>