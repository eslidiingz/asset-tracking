<script setup lang="ts">
const { currentRatio, targetRatio } = defineProps({
    currentRatio: {
        type: Number,
        required: true
    },
    targetRatio: {
        type: Number,
        required: true
    }
})

const ratioClass = computed(() => (currentRatio > targetRatio) ? 'text-red-400' : '')
</script>

<template>
    <div :class="`${ratioClass} flex items-center gap-x-0.5`">
        <Icon name="lucide:pie-chart" />
        <span>{{ formatNumber(currentRatio) }}</span>
        <span v-if="targetRatio">
            / {{ formatNumber(targetRatio) }}
        </span>
        <span>%</span>
    </div>
</template>