<script setup lang="ts">
import type { Asset } from '~/interfaces/asset.interface';

const props = defineProps<{
    asset: Asset
}>()

const portLabel = computed(() => {
    return `${props.asset?.ports?.length} Port${(props.asset?.ports?.length || 0) !== 1 ? 's' : ''}`
})
</script>

<template>
    <UiTag>{{ portLabel }}</UiTag>
</template>