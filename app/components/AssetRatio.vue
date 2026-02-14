<script setup lang="ts">
// Properties
const { asset, totalValue } = defineProps({
    asset: {
        type: Object,
        required: true
    },
    totalValue: {
        type: Number,
        default: 0
    },
})

// Computed variables
const currentRatio = computed(() => getCurrentRatio(asset.value || 0, totalValue))

// Styles & Displays
const classRatio = computed(() => {
    return {
        'text-red-400': currentRatio.value > asset.ratio,
        'text-green-400': currentRatio.value < asset.ratio
    }
})
</script>

<template>
    <div class="flex flex-col items-end justify-between" v-if="asset.ratio">
        <div class="flex items-center gap-x-0.5">
            <Icon name="lucide:chart-pie" :class="classRatio" />
            <span :class="classRatio">{{ currentRatio }}</span> / {{ asset.ratio }}%
        </div>
        <div class="text-sm text-primary" v-if="asset.value">{{ formatNumber(asset.value) }}</div>
    </div>
</template>