<script setup>
const route = useRoute()
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage :key="route.fullPath" />
        </NuxtLayout>

        <Toast style="inline-size: 100%; max-inline-size: 320px;" />
        <ConfirmDialog class="mx-4" />
    </div>
</template>