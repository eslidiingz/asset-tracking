<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
    <Button size="small" @click="emit('click')">
        <Icon name="lucide:plus" />
        <span>Add Stock</span>
    </Button>
</template>