<script setup lang="ts">
import type { Stock } from '~/interfaces/stock.interface';

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
const stocks = computed(() => port.value?.stocks as Stock[])

const portCost = computed(() => port.value?.cost || 0);
const portValue = computed(() => port.value?.value || 0);
const portProfit = computed(() => port.value?.profit_amount || 0);
const portProfitPercentage = computed(() => port.value?.profit_percentage || 0);
const stocksRatio = computed(() => port.value?.stocks?.reduce((acc, stock) => acc + (stock?.ratio || 0), 0) || 0)

// States
const visible = ref(false);

// Methods
const onCloseModal = () => {
    resetForm();
    visible.value = false;
    isEditMode.value = false;
}

const onEdit = (stock: Stock) => {
    isEditMode.value = true;
    Object.assign(form, stock)
    visible.value = true;
}

const onDelete = (stock: Stock) => {
    requireDelete(async () => {
        await deleteStock(stock)
        await stockStore.fetchAssets()
    }, `ลบหุ้นเรียบร้อยแล้ว`)
};

onMounted(() => {
    stockStore.fetchAssets()
})

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <ProgressSpinner stroke-width="5" />
    </div>

    <PortHeader v-if="port" :port="port" :portValue :portCost :portProfit :portProfitPercentage :stocksRatio />

    <PortEmpty v-if="stocks?.length === 0" title="ยังไม่มีหุ้น" description="เพิ่มหุ้นเพื่อเริ่มต้น" />

    <template v-else>
        <div class="space-y-2 mb-2">
            <div v-for="stock in stocks" :key="stock.id">
                <StockCard v-if="stock.type === 'stock'" :stock :portValue @edit="onEdit" @delete="onDelete" />
                <StockFundCard v-else-if="stock.type === 'fund'" :stock :portValue @edit="onEdit" @delete="onDelete" />
            </div>
        </div>
    </template>

    <UiButtonFloat label="Add Stock" @click="visible = true" />
    <StockModalForm v-model:visible="visible" :remainingRatio="remainingRatio" :portId @close="onCloseModal" />
</template>