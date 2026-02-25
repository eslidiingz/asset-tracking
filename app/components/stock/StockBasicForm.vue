<script setup lang="ts">

// --- Composables ---
const { isEditMode, form, isLoading, createStock, updateStock } = useStock()

// --- Methods ---
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
    <FloatLabel variant="on">
        <InputText id="symbol" name="symbol" type="text" placeholder="ตัวอย่าง: NVDA" required v-model="form.symbol"
            @input="form.symbol = form.symbol?.toUpperCase()" class="w-full" autofocus />
        <label for="symbol">ชื่อหุ้น</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="amount" name="amount" inputmode="decimal" required v-model="form.amount"
            @input="onNumericInput($event, 'amount', 8)" class="w-full" />
        <label for="amount">จำนวนหุ้นที่มี</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="cost" name="cost" inputmode="decimal" required v-model="form.cost"
            @input="onNumericInput($event, 'cost', 8)" class="w-full" />
        <label for="cost">ราคาต้นทุนเฉลี่ย</label>
    </FloatLabel>

    <div class="flex flex-col gap-1 w-full">
        <InputGroup>
            <FloatLabel variant="on">
                <InputText id="ratio" name="ratio" inputmode="decimal" v-model="form.ratio"
                    @input="onNumericInput($event, 'ratio', 2)" class="w-full" />
                <label for="ratio">สัดส่วนหุ้นเป้าหมาย</label>
            </FloatLabel>
            <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>
    </div>
</template>