<script setup>
const route = useRoute();
const portId = Number(route.params.id);

// Composables
const { requireDelete } = useAppConfirm()
const {
    isLoading,
    remainingRatio,
    resetForm,
    isEditMode,
    form,
    findSymbol,
    deleteStock
} = useStock()

const { findPort, port: portData } = usePort()
await findPort(portId)

// Stores
const stockStore = useStockStore()
const { assets } = storeToRefs(stockStore)

// Computed
const asset = computed(() => assets.value?.find(asset => asset.id === portData.value?.asset_id))
const port = computed(() => asset.value?.ports?.find(port => port.id === portId))
const stocks = computed(() => port.value?.stocks)

const portCost = computed(() => port.value?.stocks?.reduce((acc, stock) => acc + stock.cost * stock.amount, 0) || 0)
const portValue = computed(() => port.value?.stocks?.reduce((acc, stock) => acc + (findSymbol(stock.symbol)?.price || 0) * stock.amount, 0) || 0)
const portProfit = computed(() => portValue.value - portCost.value)
const portProfitPercentage = computed(() => portProfit.value / portCost.value * 100)

const stocksRatio = computed(() => port.value?.stocks?.reduce((acc, stock) => acc + stock.ratio, 0) || 0)

// States
const visible = ref(false);

// Methods
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
        await stockStore.fetchAssets()
    }, `Stock has been deleted`)
};

onMounted(() => {
    stockStore.fetchAssets()
})

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <ProgressSpinner stroke-width="5" />
    </div>

    <PortHeader :port :portValue :portCost :portProfit :portProfitPercentage :stocksRatio />

    <PortEmpty v-if="stocks?.length === 0" title="No Stocks" description="Add a stock to get started" />
    <template v-else>
        <div class="space-y-2 mb-2">
            <div v-for="stock in stocks" :key="stock.id">
                <StockCard :stock :portValue @edit="onEdit" @delete="onDelete" />
            </div>
        </div>
    </template>

    <UiButtonFloat label="Add Stock" @click="visible = true" />
    <StockModalForm v-model:visible="visible" :remainingRatio="remainingRatio" :portId @close="onCloseModal" />
</template>