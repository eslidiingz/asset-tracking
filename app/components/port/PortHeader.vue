<script setup lang="ts">
import type { Port } from '~/interfaces/port.interface';

const props = defineProps<{
    port: Port;
    portValue: number;
    portCost: number;
    portProfit: number;
    portProfitPercentage: number;
    stocksRatio: number;
}>();

const stocksCount = computed(() => props.port?.stocks?.length || 0)
</script>

<template>
    <header class="mb-2">
        <UiButtonBack :to="`/assets/${props.port?.asset_id}`" label="Back to Ports" />

        <h2 class="text-2xl font-bold mb-2">{{ props.port?.name }}
            <UiTag class="mx-1">{{ stocksCount }} Stock{{ stocksCount === 1 ? '' : 's' }}</UiTag>
        </h2>

        <div class="text-gray-400 text-sm">{{ props.port?.description }}</div>

        <div class="flex justify-between text-sm border-y border-gray-700 py-2">
            <div>
                <div>มูลค่า: <span class="text-primary">{{ formatNumber(portValue || 0) }}</span></div>
                <div class="flex items-center gap-0.5">
                    <Icon name="lucide:pie-chart" />
                    {{ formatNumber(stocksRatio || 0) }} / 100%
                </div>
            </div>

            <div>
                <div>กำไร: <span :class="{ 'text-green-500': portProfit > 0, 'text-red-500': portProfit < 0 }">{{
                    formatNumber(portProfit || 0) }} ({{ formatNumber(portProfitPercentage || 0) }}%)</span>
                </div>
                <div>ต้นทุน: <span class="text-blue-400">{{ formatNumber(portCost || 0) }}</span></div>
            </div>

        </div>
    </header>
</template>