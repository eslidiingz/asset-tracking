<script setup lang="ts">
const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    }
})

const variantClass = computed(() => {
    switch (props.variant) {
        case 'primary':
            return 'bg-primary/10 text-primary'
        case 'secondary':
            return 'bg-gray-600/30 text-gray-400'
        default:
            return 'bg-primary/10 text-primary'
    }
})
</script>

<template>
    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="variantClass">
        <slot />
    </span>
</template>