<script setup lang="ts">
const props = defineProps<{
    value: number
}>()
</script>

<template>
    <div>มูลค่า: <span class="font-bold text-primary">{{ formatNumber(props.value) }}</span></div>
</template>