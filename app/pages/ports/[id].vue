<script setup>
const route = useRoute();
const portId = Number(route.params.id);

// Composables
const { requireDelete } = useAppConfirm()
const {
    fetchStocks,
    // stocks,
    isLoading,
    ratio: stocksRatio,
    remainingRatio,
    resetForm,
    isEditMode,
    form,
    findSymbol,
    deleteStock
} = useStock()

// await fetchStocks(portId)

const { findPort, port } = usePort()
await findPort(portId)

const visible = ref(false);

const onCloseModal = () => {
    resetForm();
    visible.value = false;
    isEditMode.value = false;
}

const onEdit = (stock) => {
    isEditMode.value = true;
    form.id = stock.id;
    form.port_id = stock.port_id;
    form.symbol = stock.symbol;
    form.amount = stock.amount;
    form.cost = stock.cost;
    form.ratio = stock.ratio;
    visible.value = true;
}

const onDelete = (stock) => {
    requireDelete(async () => {
        await deleteStock(stock)
    }, `Stock has been deleted`)
};

const portCost = computed(() => port.value.stocks.reduce((acc, stock) => acc + stock.cost * stock.amount, 0))
const portValue = computed(() => port.value.stocks.reduce((acc, stock) => acc + (findSymbol(stock.symbol)?.price || 0) * stock.amount, 0))
const portProfit = computed(() => portValue.value - portCost.value)
const portProfitPercentage = computed(() => portProfit.value / portCost.value * 100)
</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <ProgressSpinner stroke-width="5" />
    </div>

    <header class="border-b border-gray-700 mb-3 pb-3">
        <UiButtonBack :to="`/assets/${port?.asset_id}`" label="Back to Ports" />

        <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold">{{ port?.name }}</h2>
            <div>Value: <span class="font-bold text-primary">{{ formatNumber(portValue || 0) }}</span></div>
        </div>

        <div class="flex flex-col text-xs font-bold">
            <span class="text-gray-400">{{ port?.description }}</span>
            <div class="flex justify-between mt-1">
                <div>Cost: <span class="text-blue-400">{{ formatNumber(portCost || 0) }}</span></div>
                <div>Profit: <span :class="{ 'text-green-500': portProfit > 0, 'text-red-500': portProfit < 0 }">{{
                    formatNumber(portProfit || 0) }} ({{ formatNumber(portProfitPercentage || 0) }}%)</span></div>
            </div>
        </div>
    </header>

    <PortEmpty title="No Stocks" description="Add a stock to get started" v-if="stocks?.length === 0" />
    <template v-else>
        <div class="flex justify-between items-center mb-2">
            <div>Portfolio ratio: </div>
            <div class="text-xs flex items-center gap-0.5">
                <Icon name="lucide:pie-chart" />
                {{ formatNumber(stocksRatio || 0) }} / 100%
            </div>
        </div>

        <div class="space-y-2 mb-2">
            <div v-for="stock in stocks" :key="stock.id">
                <StockCard :stock :portValue @edit="onEdit" @delete="onDelete" />
            </div>
        </div>
    </template>

    <UiButtonFloat label="Add Stock" @click="visible = true" />
    <StockModalForm v-model:visible="visible" :remainingRatio="remainingRatio" :portId @close="onCloseModal" />
</template>