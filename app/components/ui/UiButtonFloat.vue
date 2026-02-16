<script setup lang="ts">
defineEmits(['click'])
</script>

<template>
    <div class="fixed bottom-5 right-5">
        <Button @click="$emit('click')" icon="pi pi-plus" severity="success" size="large" rounded
            aria-label="Add new" />
    </div>
</template>
