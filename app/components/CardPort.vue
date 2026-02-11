<script setup>
const props = defineProps({
    port: Object,
    asset: Object
})

const stockStore = useStockStore();
const { currentRatio } = stockStore;
</script>

<template>
    <NuxtLink :to="`/ports/${port.id}`">
        <Card class="card-port">
            <template #title>
                <div class="flex justify-between items-center mb-1">
                    <h3>{{ port.name }} <span class="text-gray-500 text-sm" v-if="port?.stocks?.length">({{
                            port?.stocks.length }})</span></h3>
                    <div class="flex space-x-0.5 items-center">
                        <Icon name="lucide:chart-pie" class="text-lg"
                            :class="{ 'text-red-400': currentRatio(port?.value, asset?.value) > port.ratio }" />
                        <span class="text-sm"><span
                                :class="{ 'text-red-400': currentRatio(port?.value, asset?.value) > port.ratio }">{{
                                    formatNumber(currentRatio(port?.value, asset?.value), 2) }}</span> / {{ port.ratio
                            }}%</span>
                    </div>
                </div>

                <div class="flex justify-between items-end text-xs">
                    <div class="text-gray-500">Profit:</div>
                    <div class="text-right font-bold"
                        :class="{ 'text-green-500': port?.profitPercentage > 0, 'text-red-500': port?.profitPercentage < 0 }">
                        {{ formatNumber(port?.profitAmount) }} ({{ formatNumber(port?.profitPercentage, 2) }}%)</div>
                </div>

                <div class="flex justify-between items-end text-xs">
                    <div class="text-gray-500">Cost:</div>
                    <div class="font-bold text-blue-400">{{ formatNumber(port?.cost) }}</div>
                </div>

                <div class="flex justify-between items-end text-xs">
                    <div class="text-gray-500">Value:</div>
                    <div class="font-bold text-primary">{{ formatNumber(port?.value) }}</div>
                </div>

                <div class="flex justify-between items-end text-xs border-t border-gray-700/30 mt-2 pt-3 leading-none">
                    <div>
                        <Icon name="lucide:trash-2" class="text-[14px] hover:text-red-400" />
                    </div>
                    <div>
                        <Icon name="lucide:edit" class="text-[14px] hover:text-yellow-400" />
                    </div>
                </div>
            </template>

            <template #subtitle v-if="port.description">
                <div class="flex justify-between">
                    <p class="text-xs text-gray-600">{{ port.description }}</p>
                    <Icon name="lucide:arrow-right" />
                </div>
            </template>
        </Card>
    </NuxtLink>
</template>