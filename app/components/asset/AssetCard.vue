<script setup lang="ts">
const props = defineProps({
    asset: {
        type: Object,
        required: true
    },
    totalValue: {
        type: Number,
        default: 0
    },
    usdRate: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['edit', 'delete'])

const onCardClick = (event: Event) => {
    // If clicking the action component or its children, don't navigate
    const target = event.target as HTMLElement;
    if (target.closest('.asset-actions')) return;

    navigateTo(`/assets/${props.asset.id}`)
}

const profitClass = computed(() => {
    return (props.asset.profit_percentage || 0) >= 0 ? 'text-green-400' : 'text-red-400';
})

const displayValue = computed(() => {
    const val = props.asset?.value || 0
    return props.asset.currency === 'usd' ? val * props.usdRate : val
})

const displayCost = computed(() => {
    const cost = props.asset?.cost || 0
    return props.asset.currency === 'usd' ? cost * props.usdRate : cost
})

const displayProfitAmount = computed(() => {
    const profit = props.asset?.profit_amount || 0
    return props.asset.currency === 'usd' ? profit * props.usdRate : profit
})

const currentRatio = computed(() => {
    return getCurrentRatio(displayValue.value, props.totalValue)
})
</script>

<template>
    <div class="active:scale-[0.98] md:hover:scale-[1.01] transition-transform duration-200 cursor-pointer touch-manipulation"
        @click="onCardClick">
        <Card class="card-port overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <template #title>
                <div class="flex justify-between items-center">
                    <div class="mb-1">
                        <h3 class="font-bold flex gap-x-1 text-lg text-gray-900 dark:text-gray-100 truncate">
                            {{ asset.name }}
                            <UiTag>{{ `${asset?.ports?.length} Port${(asset?.ports?.length || 0) !== 1 ? 's' : ''}` }}
                            </UiTag>
                            <UiTag variant="secondary">{{ asset.currency.toUpperCase() }}</UiTag>
                        </h3>
                        <p class="text-sm text-gray-500 line-clamp-1 italic leading-snug">
                            {{ asset.description }}
                        </p>
                    </div>
                    <AssetCardActions @edit="emit('edit')" @delete="emit('delete')" class="asset-actions" />
                </div>
            </template>

            <template #content>
                <div class="flex justify-between items-center gap-2">
                    <div class="flex-1 min-w-0 text-sm">
                        <div class="flex justify-between">
                            <div>มูลค่า: <span class="text-primary font-bold">{{ formatNumber(displayValue) }}</span>
                            </div>
                            <UiCurrentRatio :value="currentRatio" :target="asset.ratio" />
                        </div>

                        <div class="flex justify-between">
                            <div>กำไร: <span :class="profitClass">{{ formatNumber(displayProfitAmount) }} ({{
                                formatNumber(asset?.profit_percentage) }}%)</span></div>
                            <div>ต้นทุน: <span class="text-blue-400">{{ formatNumber(displayCost) }}</span></div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
:deep(.p-card-body) {
    padding: 1rem;
}

@media (min-width: 768px) {
    :deep(.p-card-body) {
        padding: 1.25rem;
    }
}

/* Touch feedback for the whole card */
.card-port:active {
    background-color: rgba(0, 0, 0, 0.02);
}

.dark .card-port:active {
    background-color: rgba(255, 255, 255, 0.02);
}
</style>