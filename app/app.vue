<script setup lang="ts">
const route = useRoute()
const stockStore = useStockStore()
const { assets } = storeToRefs(stockStore)

// Global Ownership Protection Guard
// Checks if current resource-based page belongs to the user
watchEffect(() => {
    // Only check if assets have been loaded
    if (assets.value.length === 0) return

    const path = route.path
    const params = route.params

    // Check Assets Page: /assets/[id]
    if (path.startsWith('/assets/') && params.id) {
        const id = Number(params.id)
        const hasAccess = assets.value.some(a => a.id === id)
        if (!hasAccess) navigateTo('/')
    }

    // Check Ports Page: /ports/[id]
    if (path.startsWith('/ports/') && params.id) {
        const id = Number(params.id)
        const hasAccess = assets.value.some(a => a.ports.some(p => p.id === id))
        if (!hasAccess) navigateTo('/')
    }
})
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