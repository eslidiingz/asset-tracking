<script setup>
defineProps({
    title: {
        type: String,
        default: 'ยังไม่มีพอร์ต'
    },
    description: {
        type: String,
        default: 'เพิ่มพอร์ตเพื่อเริ่มต้น'
    }
})
</script>

<template>
    <div class="flex justify-center items-center my-16">
        <div class="text-center">
            <img src="/icons/no-data.svg" alt="no-data" class="w-full h-auto max-w-md mx-auto px-4">
            <div class="flex flex-col gap-2 mt-8">
                <p class="text-4xl font-bold">{{ title }}</p>
                <p class="text-gray-500">{{ description }}</p>
            </div>
        </div>
    </div>
</template>