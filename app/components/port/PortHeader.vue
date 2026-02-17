<script setup lang="ts">
import type { Port } from '~/interfaces/port.interface';

const props = defineProps<{
    port: Port;
    portValue: number;
    portCost: number;
    portProfit: number;
    portProfitPercentage: number;
}>();

const stocksCount = computed(() => props.port?.stocks?.length || 0)
</script>

<template>
    <header class="border-b border-gray-700 mb-3 pb-3">
        <UiButtonBack :to="`/assets/${props.port?.asset_id}`" label="Back to Ports" />

        <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold">{{ props.port?.name }}
                <UiTag>{{ stocksCount }} Stock{{ stocksCount === 1 ? '' : 's' }}</UiTag>
            </h2>
            <div>Value: <span class="font-bold text-primary">{{ formatNumber(portValue || 0) }}</span></div>
        </div>

        <div class="flex flex-col text-xs font-bold">
            <span class="text-gray-400">{{ props.port?.description }}</span>
            <div class="flex justify-between mt-1">
                <div>Cost: <span class="text-blue-400">{{ formatNumber(portCost || 0) }}</span></div>
                <div>Profit: <span :class="{ 'text-green-500': portProfit > 0, 'text-red-500': portProfit < 0 }">{{
                    formatNumber(portProfit || 0) }} ({{ formatNumber(portProfitPercentage || 0) }}%)</span></div>
            </div>
        </div>
    </header>
</template>