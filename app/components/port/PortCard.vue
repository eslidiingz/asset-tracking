<script setup lang="ts">
import type { Port } from '~/interfaces/port.interface';
import type { Asset } from '~/interfaces/asset.interface';

const props = defineProps({
    port: {
        type: Object as PropType<Port>,
        required: true
    },
    asset: {
        type: Object as PropType<Asset>,
        default: null
    }
})

const emit = defineEmits(['edit', 'delete'])

const stockStore = useStockStore();
const { currentRatio } = stockStore;
</script>

<template>
    <div class="relative group">
        <NuxtLink :to="`/ports/${port.id}`" class="block">
            <Card class="card-port hover:border-primary/50 transition-colors">
                <template #title>
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-lg text-white group-hover:text-primary transition-colors">
                            {{ port.name }}
                            <span class="text-gray-500 text-sm font-normal" v-if="port?.stocks?.length">
                                ({{ port?.stocks.length }})
                            </span>
                        </h3>
                        <div class="flex space-x-1 items-center">
                            <Icon name="lucide:chart-pie" class="text-base"
                                :class="{ 'text-red-400': currentRatio(port?.value || 0, asset?.value || 0) > (port.ratio || 0) }" />
                            <span class="text-sm font-mono text-gray-300">
                                <span
                                    :class="{ 'text-red-400': currentRatio(port?.value || 0, asset?.value || 0) > (port.ratio || 0) }">
                                    {{ formatNumber(currentRatio(port?.value || 0, asset?.value || 0), 2) }}
                                </span> / {{ port.ratio || 0 }}%
                            </span>
                        </div>
                    </div>
                </template>

                <template #subtitle v-if="port.description">
                    <p class="text-xs text-gray-600 line-clamp-1 mt-1">{{ port.description }}</p>
                </template>

                <template #content>
                    <div class="space-y-1 mt-2">
                        <div class="flex justify-between items-end text-xs">
                            <div class="text-gray-500">Profit:</div>
                            <div class="text-right font-bold"
                                :class="{ 'text-green-500': (port?.profitPercentage || 0) > 0, 'text-red-500': (port?.profitPercentage || 0) < 0 }">
                                {{ formatNumber(port?.profitAmount || 0) }} ({{
                                    formatNumber(port?.profitPercentage || 0, 2) }}%)</div>
                        </div>

                        <div class="flex justify-between items-end text-xs">
                            <div class="text-gray-500">Cost:</div>
                            <div class="font-bold text-blue-400">{{ formatNumber(port?.cost || 0) }}</div>
                        </div>

                        <div class="flex justify-between items-end text-xs">
                            <div class="text-gray-500">Value:</div>
                            <div class="font-bold text-primary">{{ formatNumber(port?.value || 0) }}</div>
                        </div>
                    </div>
                </template>

                <template #footer>
                    <div class="flex justify-between items-center border-t border-gray-700/30 mt-3 pt-2">
                        <!-- Action buttons with larger hit areas -->
                        <button @click.stop.prevent="emit('delete')"
                            class="p-3 -m-3 text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center outline-none"
                            title="Delete Portfolio">
                            <Icon name="lucide:trash-2" class="text-xl" />
                        </button>
                        <button @click.stop.prevent="emit('edit')"
                            class="p-3 -m-3 text-gray-500 hover:text-primary transition-colors flex items-center justify-center outline-none"
                            title="Edit Portfolio">
                            <Icon name="lucide:edit" class="text-xl" />
                        </button>
                    </div>
                </template>
            </Card>
        </NuxtLink>
    </div>
</template>

<style scoped>
.card-port :deep(.p-card-body) {
    padding: 1rem;
}

.card-port :deep(.p-card-title) {
    margin-bottom: 0;
}
</style>