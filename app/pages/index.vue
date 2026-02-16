<script setup lang="ts">
import type { Asset } from '~/interfaces/asset.interface';

const { fetchAssets, deleteAsset } = useAsset()
const { assets } = storeToRefs(useAssetStore())
const { requireDelete } = useAppConfirm()

await fetchAssets();

const visible = ref<boolean>(false);
const editingAsset = ref<Asset | null>(null);

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
            await fetchAssets()
        }

        return result
    }, 'Asset has been deleted')
}

const onCloseModal = () => {
    visible.value = false;
    editingAsset.value = null;
}

const onUpdateAssets = async () => {
    await fetchAssets();
}
</script>



<template>
    <header class="flex justify-between items-center mb-3">
        <h2 class="text-2xl font-bold">My Assets</h2>
        <div>
            <span>Value: </span>
            <span class="font-bold text-primary">
                <!-- {{ formatNumber(assetTotalValue || 0) }} -->
            </span>
        </div>
    </header>

    <hr class="my-2">

    <PortEmpty v-if="assets?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>Assets ratio: </div>
            <!-- <div class="text-xs">{{ formatNumber(assetsRatio || 0) }}/100%</div> -->
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="asset in assets" :key="asset.id">
                <AssetCard :asset="asset" @edit="onEditAsset(asset)" @delete="onDeleteAsset(asset)" />
            </div>
        </div>
    </template>

    <UiButtonFloat @click="visible = true" />
    <AssetModalForm v-model:visible="visible" :asset="editingAsset" @close="onCloseModal"
        @update:assets="onUpdateAssets" />
</template>
