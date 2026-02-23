<script setup lang="ts">
const props = defineProps({
    value: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
        default: 0
    },
    profitPercentage: {
        type: Number,
        default: 0
    }
})

const classProfit = computed(() => {
    const val = Number(props.profit);
    if (val > 0) return 'text-green-400 font-bold'
    if (val < 0) return 'text-red-400 font-bold'
    return 'text-gray-400'
})
</script>

<template>
    <header class="border-b border-gray-700 pb-2 mb-2">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">สินทรัพย์ของฉัน</h2>

            <div>
                <span>มูลค่า: </span>
                <span class="font-bold text-primary">
                    {{ formatNumber(value) }}
                </span>
            </div>
        </div>

        <div class="flex justify-between items-center text-sm">
            <div>
                <span>ต้นทุน: </span>
                <span class="font-bold text-blue-400">
                    {{ formatNumber(cost) }}
                </span>
            </div>
            <div>
                <span>กำไร: </span>
                <span :class="classProfit">
                    {{ formatNumber(profit) }} ({{ formatNumber(profitPercentage) }}%)
                </span>
            </div>
        </div>
    </header>
</template>