<script setup lang="ts">
const props = defineProps({
    asset: {
        type: Object,
        required: true
    }
})

const stockStore = useStockStore()
const { assets } = storeToRefs(stockStore)

const assetTotalValue = computed(() => assets.value.reduce((acc: number, item: any) => acc + item.value, 0))

const { currentRatio } = stockStore
</script>

<template>
    <NuxtLink :to="`/assets/${asset.id}`">
        <Card class="card-port">
            <template #title>
                <div class="flex justify-between">
                    <div>
                        <h3 class="flex items-center">
                            <!-- <span class="inline-block bg-red-400 w-4 h-4 rounded-full me-1">&nbsp;</span> -->
                            <span>{{ asset.name }}</span>
                        </h3>
                        <span class="text-sm text-gray-500" v-if="asset?.ports?.length">Port: {{ asset?.ports.length
                            }}</span>
                    </div>
                    <div class="flex flex-col items-end justify-between">
                        <div class="flex items-center gap-x-0.5">
                            <Icon name="lucide:chart-pie"
                                :class="{ 'text-red-400': currentRatio(asset.value, assetTotalValue) > asset.ratio }" />
                            <span
                                :class="{ 'text-red-400': currentRatio(asset.value, assetTotalValue) > asset.ratio, 'text-green-400': currentRatio(asset.value, assetTotalValue) < asset.ratio }">{{
                                    currentRatio(asset.value, assetTotalValue) }}</span> / {{ asset.ratio }}%
                        </div>
                        <div class="text-sm text-primary">{{ formatNumber(asset.value) }}</div>
                    </div>
                </div>
            </template>
            <template #subtitle v-if="asset.description">
                <div class="flex justify-between">
                    <p class="text-xs text-gray-600">{{ asset.description }}</p>
                    <Icon name="lucide:arrow-right" />
                </div>
            </template>
        </Card>
    </NuxtLink>
</template>