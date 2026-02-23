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

// --- Computed ---
const symbolRatio = computed(() => props.portValue > 0 ? (props.stock?.value / props.portValue * 100) : 0)
const profitClass = computed(() => props.stock.profit_amount > 0 ? 'text-green-400' : 'text-red-400')
</script>

<template>
    <NuxtLink :to="`#`">
        <Card class="card-port">
            <template #content>
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <h3>{{ stock.symbol }}</h3>
                        <p class="text-xs">{{ stock.amount?.toFixed(4) }}</p>
                    </div>
                    <div class="flex gap-x-4">
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(stock?.price || 0) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(stock.cost || 0) }}</div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div>{{ formatNumber(stock?.value || 0) }}</div>
                            <div v-if="stock.cost" class="text-blue-400">{{ formatNumber(stock?.total_cost || 0) }}
                            </div>
                        </div>
                        <div class="flex flex-col gap-y-1 items-end text-xs">
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(stock?.profit_percentage || 0) }}%</div>
                            <div :class="`font-bold ${profitClass}`">
                                {{ formatNumber(stock?.profit_amount || 0) }}</div>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-between">
                    <UiCurrentRatio class="text-xs" :value="symbolRatio" :target="stock.ratio" />

                    <div class="flex gap-x-3">
                        <Icon name="lucide:trash-2" class="hover:text-red-400" @click.prevent="emit('delete', stock)" />
                        <Icon name="lucide:edit" class="hover:text-yellow-400" @click.prevent="emit('edit', stock)" />
                    </div>
                </div>
            </template>
        </Card>
    </NuxtLink>
</template>