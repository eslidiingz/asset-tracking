<script setup lang="ts">
import type { Asset } from '~/interfaces/asset.interface';

const props = defineProps<{
    asset: Asset
}>()

const classProfit = computed(() => {
    if (!props.asset?.profitPercentage) return ''
    return props.asset?.profitPercentage > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'
})
</script>

<template>
    <header class="border-b border-gray-600 pb-2 mb-2">
        <UiButtonBack to="/" label="กลับไปหน้าสินทรัพย์" />

        <div class="flex justify-between items-end" v-if="asset">
            <h2 class="text-2xl font-bold">
                <span>{{ asset?.name }}</span>
                <AssetPortLabel :asset />
            </h2>
            <AssetValue :value="asset?.value || 0" />
        </div>

        <div class="flex justify-between items-center">
            <div class="text-sm">ต้นทุน: <span class="text-blue-400 font-bold">{{ formatNumber(asset?.cost || 0)
                    }}</span>
            </div>
            <div class="flex items-center gap-0.5 text-sm">
                <span>กำไร: </span>
                <span :class="classProfit">{{
                    formatNumber(asset?.profitAmount || 0) }} ({{ formatNumber(asset?.profitPercentage || 0, 2)
                    }}%)</span>
            </div>
        </div>
    </header>
</template>