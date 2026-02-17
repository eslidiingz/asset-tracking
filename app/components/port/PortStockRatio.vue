<script setup lang="ts">
const props = defineProps<{
    stocksRatio: number;
}>();
</script>

<template>
    <div class="flex justify-between items-center mb-2">
        <div>Portfolio ratio: </div>
        <div class="text-xs flex items-center gap-0.5">
            <Icon name="lucide:pie-chart" />
            {{ formatNumber(stocksRatio || 0) }} / 100%
        </div>
    </div>
</template>