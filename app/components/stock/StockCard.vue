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

// Stores
const { priceList } = storeToRefs(useStockStore())

// Computed
const symbolPrice = computed(() => priceList.value.find(s => s.symbol === props.stock.symbol)?.price || 0)
const symbolCost = computed(() => props.stock.cost * props.stock.amount)
const symbolValue = computed(() => symbolPrice.value * props.stock.amount)
const symbolProfitAmount = computed(() => symbolValue.value - symbolCost.value)
const symbolProfitPercentage = computed(() => symbolProfitAmount.value / symbolCost.value * 100)
const symbolRatio = computed(() => symbolCost.value * (1 + (symbolProfitPercentage.value / 100)) / props.portValue * 100)

const profitClass = computed(() => symbolProfitPercentage.value > 0 ? 'text-green-400' : 'text-red-400')
</script>

<template>
    <NuxtLink :to="`#`">
        <Card class="card-port">
            <template #content>
                <div class="flex justify-between items-center mb-2">
                    <h3>{{ stock.symbol }}</h3>
                    <div class="flex gap-x-4">
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(Number(symbolPrice) || 0) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(stock.cost || 0) }}</div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(symbolValue || 0) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(symbolCost || 0) }}</div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(symbolProfitPercentage || 0) }}%</div>
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(symbolProfitAmount || 0) }}</div>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-between">
                    <p class="text-xs">{{ stock.amount?.toFixed(7) }}</p>

                    <div class="flex gap-x-3">
                        <UiCurrentRatio class="text-xs" :currentRatio="symbolRatio" :targetRatio="stock.ratio" />
                        <Icon name="lucide:edit" class="hover:text-yellow-400" @click.prevent="emit('edit', stock)" />
                        <Icon name="lucide:trash-2" class="hover:text-red-400" @click.prevent="emit('delete', stock)" />
                    </div>
                </div>
            </template>
        </Card>
    </NuxtLink>
</template>