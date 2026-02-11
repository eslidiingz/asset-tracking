<script setup lang="ts">
const props = defineProps({
    stock: {
        type: Object,
        required: true
    },
    portValue: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const { priceList } = storeToRefs(useStockStore())

const symbolPrice = computed(() => priceList.value.find(s => s.symbol === props.stock.symbol)?.price || 0)
const symbolCost = computed(() => props.stock.cost * props.stock.amount)
const symbolValue = computed(() => symbolPrice.value * props.stock.amount)
const symbolProfitAmount = computed(() => symbolValue.value - symbolCost.value)
const symbolProfitPercentage = computed(() => symbolProfitAmount.value / symbolCost.value * 100)
const symbolRatio = computed(() => symbolCost.value * (1 + (symbolProfitPercentage.value / 100)) / props.portValue * 100)

const profitClass = computed(() => symbolProfitPercentage.value > 0 ? 'text-green-400' : 'text-red-400')
const ratioClass = computed(() => symbolRatio.value > props.stock.ratio ? 'text-red-400' : 'text-green-400')
</script>

<template>
    <NuxtLink :to="`/stocks/${stock.id}`">
        <Card class="card-port">
            <template #title>
                <div class="flex justify-between items-center">
                    <h3>{{ stock.symbol }}</h3>
                    <div class="flex gap-x-4">
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(Number(symbolPrice)) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(stock.cost) }}</div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(symbolValue) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(symbolCost) }}</div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(symbolProfitPercentage) }}%</div>
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(symbolProfitAmount) }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template #subtitle>
                <div class="flex justify-between">
                    <div>
                        <p class="text-xs">{{ stock.amount?.toFixed(7) }}</p>
                    </div>
                    <div class="flex gap-x-3">
                        <div class="text-xs flex items-center gap-x-0.5" v-if="stock.ratio">
                            <Icon name="lucide:pie-chart" :class="ratioClass" />
                            <div>
                                <span :class="ratioClass">
                                    {{ formatNumber(symbolRatio) }}</span>
                                / <span>{{ stock.ratio }}</span>%
                            </div>
                        </div>
                        <Icon name="lucide:edit" class="hover:text-yellow-400" @click.prevent="emit('edit', stock)" />
                        <Icon name="lucide:trash-2" class="hover:text-red-400" @click.prevent="emit('delete', stock)" />
                    </div>
                </div>
            </template>
        </Card>
    </NuxtLink>
</template>