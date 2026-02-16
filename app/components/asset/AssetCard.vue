<script setup lang="ts">
const props = defineProps({
    asset: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const onCardClick = (event: Event) => {
    // If clicking the action component or its children, don't navigate
    const target = event.target as HTMLElement;
    if (target.closest('.asset-actions')) return;

    navigateTo(`/assets/${props.asset.id}`)
}
</script>

<template>
    <div class="active:scale-[0.98] md:hover:scale-[1.01] transition-transform duration-200 cursor-pointer touch-manipulation"
        @click="onCardClick">
        <Card class="card-port overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <template #title>
                <div class="flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                            {{ asset.name }}
                        </h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                {{ asset?.ports?.length || 0 }} Port{{ (asset?.ports?.length || 0) !== 1 ? 's' : '' }}
                            </span>
                            <span v-if="asset.ratio" class="text-xs text-gray-500">
                                Target: {{ asset.ratio }}%
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-1 shrink-0">
                        <AssetRatio :asset />
                        <!-- Action Molecule: Handles Edit/Delete operations -->
                        <AssetCardActions @edit="emit('edit')" @delete="emit('delete')" class="asset-actions" />
                    </div>
                </div>
            </template>

            <template #subtitle v-if="asset.description">
                <div class="mt-2 flex justify-between items-end">
                    <p class="text-sm text-gray-500 line-clamp-2 italic leading-snug pr-4">
                        {{ asset.description }}
                    </p>
                    <Icon name="lucide:chevron-right" class="text-gray-300 shrink-0 mb-1" />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
:deep(.p-card-body) {
    padding: 1rem;
}

@media (min-width: 768px) {
    :deep(.p-card-body) {
        padding: 1.25rem;
    }
}

/* Touch feedback for the whole card */
.card-port:active {
    background-color: rgba(0, 0, 0, 0.02);
}

.dark .card-port:active {
    background-color: rgba(255, 255, 255, 0.02);
}
</style>