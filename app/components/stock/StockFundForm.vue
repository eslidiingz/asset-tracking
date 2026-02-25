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
    <FloatLabel variant="on">
        <InputText id="symbol" name="symbol" type="text" placeholder="ตัวอย่าง: SCBNDQ(A)" required
            v-model="form.symbol" class="w-full" autofocus />
        <label for="symbol">ชื่อกองทุน</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="amount" name="amount" inputmode="decimal" required v-model="form.amount"
            @input="onNumericInput($event, 'amount', 8)" class="w-full" />
        <label for="amount">จำนวนหน่วยที่มี</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="cost" name="cost" inputmode="decimal" required v-model="form.cost"
            @input="onNumericInput($event, 'cost', 8)" class="w-full" />
        <label for="cost">ราคาต้นทุนเฉลี่ย</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="total_cost" name="total_cost" inputmode="decimal" required v-model="form.total_cost"
            @input="onNumericInput($event, 'total_cost', 8)" class="w-full" />
        <label for="total_cost">ราคาต้นทุนรวม</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="price" name="price" inputmode="decimal" required v-model="form.price"
            @input="onNumericInput($event, 'price', 8)" class="w-full" />
        <label for="price">ราคาปัจจุบัน</label>
    </FloatLabel>

    <FloatLabel variant="on">
        <InputText id="value" name="value" inputmode="decimal" required v-model="form.value"
            @input="onNumericInput($event, 'value', 8)" class="w-full" />
        <label for="value">มูลค่าปัจจุบัน</label>
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