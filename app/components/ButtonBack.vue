<script setup lang="ts">
    const props = defineProps({
        to: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: 'Back'
        }
    })
</script>

<template>
    <NuxtLink :to="to" class="btn-back">
        <Icon name="lucide:chevron-left" />
        <span>{{ label }}</span>
    </NuxtLink>
</template>