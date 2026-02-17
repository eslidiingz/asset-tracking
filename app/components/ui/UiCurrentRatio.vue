<script setup lang="ts">
const { value, target } = defineProps({
    value: {
        type: Number,
        required: true
    },
    target: {
        type: Number,
        required: true
    }
})

const ratioClass = computed(() => (value > target) ? 'text-red-400' : '')
</script>

<template>
    <div :class="`${ratioClass} flex items-center gap-x-0.5`">
        <Icon name="lucide:pie-chart" />
        <span>{{ formatNumber(value, 2) }}</span>
        <span v-if="target">
            / {{ formatNumber(target, 2) }}%
        </span>
    </div>
</template>