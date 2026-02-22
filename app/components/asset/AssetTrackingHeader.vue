<script setup lang="ts">
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <header class="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
        <h2 class="text-2xl font-bold">สินทรัพย์ของฉัน</h2>

        <div>
            <span>มูลค่า: </span>
            <span class="font-bold text-primary">
                {{ formatNumber(value) }}
            </span>
        </div>
    </header>
</template>