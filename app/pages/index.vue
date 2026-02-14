<script setup lang="ts">
const { fetchAssets } = useAsset()
const { assets } = storeToRefs(useAssetStore())
await fetchAssets();

const visible = ref<boolean>(false);

const onCloseModal = () => {
    visible.value = false;
}

const onUpdateAssets = async () => {
    await fetchAssets();
}

// const stockStore = useStockStore()
// const { assets } = storeToRefs(stockStore)

// const { currentRatio } = stockStore

// await stockStore.fetchPriceList()

// const assetsRatio = computed(() => assets.value.reduce((acc, port) => acc + port.ratio, 0))
// const remainingRatio = computed(() => 100 - assetsRatio.value)

// const assetTotalValue = computed(() => assets.value.reduce((acc, item: any) => acc + item.value, 0))

// const visible = ref<boolean>(false);

// const onCloseModal = () => {
//     visible.value = false;
// }

// const onUpdateAssets = async () => {
//     await stockStore.fetchAssets()
// }

const addPortfolio = async () => {
    // const { $api } = useNuxtApp()
    // isLoading.value = true;
    // try {
    //     const response = await $api(`/api/assets`, {
    //         method: 'POST',
    //         body: form
    //     })

    //     if (response.success) {
    //         onCloseModal();
    //         await fetchAssets();
    //     }
    // } catch (error) {
    //     console.error('Failed to create portfolio', error)
    // } finally {
    //     isLoading.value = false;
    // }
};
</script>

<template>
    <header class="flex justify-between items-center mb-3">
        <h2 class="text-2xl font-bold">My Assets</h2>
        <div>
            <span>Value: </span>
            <span class="font-bold text-primary">
                <!-- {{ formatNumber(assetTotalValue) }} -->
            </span>
        </div>
    </header>

    <!-- <ButtonFloat @click="visible = true" v-if="remainingRatio > 0" /> -->

    <hr class="my-2">

    <PortEmpty v-if="assets?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>Assets ratio: </div>
            <!-- <div class="text-xs">{{ formatNumber(assetsRatio) }}/100%</div> -->
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="asset in assets" :key="asset.id">
                <CardAsset :asset="asset" />
            </div>
        </div>
    </template>

    <ButtonFloat @click="visible = true" />
    <ModalAssetForm v-model:visible="visible" @close="onCloseModal" @update:assets="onUpdateAssets" />
</template>
