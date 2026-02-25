<script setup lang="ts">
import type { Asset } from '~/interfaces/asset.interface';

// Stores
const stockStore = useStockStore()
const { assets, usdRate } = storeToRefs(stockStore)
await stockStore.fetchAssets()

// Composables
const { deleteAsset } = useAsset()
const { requireDelete } = useAppConfirm()

// States
const visible = ref<boolean>(false);
const editingAsset = ref<Asset | null>(null);

// Computed
const assetsRatio = computed(() => {
    return assets.value?.reduce((acc, asset) => acc + asset.ratio, 0) || 0
})

const assetsTrackingValue = computed(() => {
    return assets.value?.reduce((acc, asset) => {
        const value = asset.value || 0
        return acc + (asset.currency === 'usd' ? value * usdRate.value : value)
    }, 0) || 0
})

const assetTrackingCost = computed(() => {
    return assets.value?.reduce((acc, asset) => {
        const cost = asset.cost || 0
        return acc + (asset.currency === 'usd' ? cost * usdRate.value : cost)
    }, 0) || 0
})

const assetTrackingProfitAmount = computed(() => {
    return assets.value?.reduce((acc, asset) => {
        const profit = asset.profit_amount || 0
        return acc + (asset.currency === 'usd' ? profit * usdRate.value : profit)
    }, 0) || 0
})

const assetTrackingProfitPercentage = computed(() => {
    return assetTrackingCost.value > 0 ? (assetTrackingProfitAmount.value / assetTrackingCost.value * 100) : 0
})

// Methods
const onEditAsset = (asset: Asset) => {
    editingAsset.value = asset;
    visible.value = true;
}

const onDeleteAsset = async (asset: Asset) => {
    const assetId = asset.id
    if (!assetId) return

    requireDelete(async () => {
        const result = await deleteAsset(assetId)

        if (result?.success) {
            await stockStore.fetchAssets()
        }

        return result
    }, 'ลบสินทรัพย์เรียบร้อยแล้ว')
}

const onCloseModal = () => {
    visible.value = false;
    editingAsset.value = null;
}

const onUpdateAssets = async () => {
    await stockStore.fetchAssets();
}
</script>



<template>
    <AssetTrackingHeader :value="assetsTrackingValue" :cost="assetTrackingCost" :profit="assetTrackingProfitAmount"
        :profit_percentage="assetTrackingProfitPercentage" />

    <PortEmpty v-if="assets?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>สัดส่วนสินทรัพย์: </div>
            <div class="text-xs">{{ formatNumber(assetsRatio) }}/100%</div>
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="asset in assets" :key="asset.id">
                <AssetCard :asset="asset" :totalValue="assetsTrackingValue" :usdRate="usdRate"
                    @edit="onEditAsset(asset)" @delete="onDeleteAsset(asset)" />
            </div>
        </div>
    </template>

    <UiButtonFloat @click="visible = true" />
    <AssetModalForm v-model:visible="visible" :asset="editingAsset" @close="onCloseModal"
        @update:assets="onUpdateAssets" />
</template>
