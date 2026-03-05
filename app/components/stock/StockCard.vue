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
// const symbol_price = computed(() => props.stock.value || priceList.value.find(s => s.symbol === props.stock.symbol)?.price || 0)
const symbol_cost = computed(() => props.stock.cost * props.stock.amount)
const symbol_value = computed(() => props?.stock?.price * props.stock.amount)
const symbol_profit_amount = computed(() => symbol_value.value - symbol_cost.value)
const symbol_profit_percentage = computed(() => symbol_cost.value > 0 ? (symbol_profit_amount.value / symbol_cost.value * 100) : 0)
const symbol_ratio = computed(() => props.portValue > 0 ? (symbol_value.value / props.portValue * 100) : 0)

const profitClass = computed(() => symbol_profit_percentage.value > 0 ? 'text-green-400' : 'text-red-400')
</script>

<template>
    <!-- <NuxtLink :to="`#`"> -->
    <Card class="card-port">
        <template #content>
            <div class="flex justify-between items-center mb-2">
                <div>
                    <h3 class="font-bold flex gap-x-1 text-lg text-gray-900 dark:text-gray-100 truncate">{{
                        stock.symbol }}</h3>
                    <p class="text-xs">{{ stock.amount?.toFixed(7) }}</p>
                </div>
                <div class="flex gap-x-4">
                    <div class="flex flex-col gap-y-1 items-end text-xs">
                        <div>{{ formatNumber(stock?.price || 0) }}</div>
                        <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(stock.cost || 0) }}</div>
                    </div>
                    <div class="flex flex-col gap-y-1 items-end text-xs">
                        <div>{{ formatNumber(symbol_value || 0) }}</div>
                        <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(symbol_cost || 0) }}</div>
                    </div>
                    <div class="flex flex-col gap-y-1 items-end text-xs">
                        <div :class="`font-bold ${profitClass}`">
                            {{ formatNumber(symbol_profit_percentage || 0) }}%</div>
                        <div :class="`font-bold ${profitClass}`">
                            {{ formatNumber(symbol_profit_amount || 0) }}</div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-between">
                <UiCurrentRatio class="text-xs" :value="symbol_ratio" :target="stock.ratio" />

                <div class="flex gap-x-3">
                    <Icon name="lucide:trash-2" class="hover:text-red-400" @click.prevent="emit('delete', stock)" />
                    <Icon name="lucide:edit" class="hover:text-yellow-400" @click.prevent="emit('edit', stock)" />
                </div>
            </div>
        </template>
    </Card>
    <!-- </NuxtLink> -->
</template>