<script setup>
const route = useRoute();
const portId = route.params.id;

const confirm = useConfirm();
const toast = useToast();

const {
    fetchStocks,
    stocks,
    isLoading,
    ratio: stocksRatio,
    remainingRatio,
    symbols,
    resetForm,
    isEditMode,
    form,
    findSymbol,
    deleteStock
} = useStock()

await fetchStocks(portId)

const { findPort, port } = usePort()
await findPort(portId)

const { priceList } = storeToRefs(useStockStore())

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
    confirm.require({
        message: `Do you want to delete ${stock.symbol} stock?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger',
        },
        accept: async () => {
            await deleteStock(stock)
            toast.add({ severity: 'success', summary: 'Deleted', detail: 'Stock removed', life: 3000 });
        },
    });
};

const portCost = computed(() => stocks.value.reduce((acc, stock) => acc + stock.cost * stock.amount, 0))
const portValue = computed(() => stocks.value.reduce((acc, stock) => acc + (findSymbol(stock.symbol)?.price || 0) * stock.amount, 0))
const portProfit = computed(() => portValue.value - portCost.value)
const portProfitPercentage = computed(() => portProfit.value / portCost.value * 100)
</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <ProgressSpinner stroke-width="5" />
    </div>

    <header class="flex justify-between items-start mb-4">
        <ButtonBack :to="`/assets/${port?.asset_id}`" />
        <ButtonAdd @click="visible = true" v-if="stocksRatio < 100" />
    </header>

    <div class="flex justify-between items-start">
        <h2 class="text-2xl font-bold">{{ port?.name }}</h2>
        <div>Value: <span class="font-bold text-primary">{{ formatNumber(portValue) }}</span></div>
    </div>

    <div class="flex flex-col text-xs font-bold">
        <span class="text-gray-400">{{ port?.description }}</span>
        <div class="flex justify-between mt-1">
            <div class="">Cost: <span class="text-blue-400">{{ formatNumber(portCost) }}</span></div>
            <div class="">Profit: <span :class="{ 'text-green-500': portProfit > 0, 'text-red-500': portProfit < 0 }">{{
                formatNumber(portProfit) }} ({{ formatNumber(portProfitPercentage) }}%)</span></div>
        </div>
    </div>

    <hr class="my-4 border-gray-700">

    <PortEmpty title="No Stocks" description="Add a stock to get started" v-if="stocks?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-2">
            <div>Portfolio ratio: </div>
            <div class="text-xs font-mono">{{ formatNumber(stocksRatio) }} / 100%</div>
        </div>

        <div class="space-y-3 mb-6">
            <div v-for="stock in stocks" :key="stock.id">
                <CardStock :stock :portValue @edit="onEdit" @delete="onDelete" />
            </div>
        </div>
    </template>

    <ModalStockForm v-model:visible="visible" :remainingRatio="remainingRatio" :portId @close="onCloseModal" />
</template>