<script setup lang="ts">
const route = useRoute();
const assetId = route.params.id as string;
import type { Port } from '~/interfaces/port.interface';

// States
const visible = ref<boolean>(false);
const editingPort = ref<Port | null>(null);

// Composables
const { findAsset } = useAsset();
const { fetchPorts, deletePort, ports } = usePort();
const { requireDelete } = useAppConfirm();

const asset = await findAsset(assetId);
await fetchPorts(Number(assetId));

const onEditPort = (port: Port) => {
    editingPort.value = port;
    visible.value = true;
}

const onDeletePort = async (port: Port) => {
    const portId = port.id
    if (!portId) return

    requireDelete(async () => {
        const result = await deletePort(portId)
        if (result?.success) {
            await fetchPorts(Number(assetId))
        }
        return result
    }, 'Portfolio has been deleted')
}

const onUpdatePorts = async () => {
    await fetchPorts(Number(assetId));
}

const onCloseModal = () => {
    visible.value = false;
    editingPort.value = null;
}

// const stockStore = useStockStore();
// const { currentRatio } = stockStore;
// const { assets } = storeToRefs(stockStore);

// const asset = computed(() => assets.value.find((asset) => asset.id === Number(assetId)))
// const assetsRatio = computed(() => asset.value?.ports.reduce((acc, port) => acc + port.ratio, 0))
// const remainingRatio = computed(() => 100 - assetsRatio.value)


// const isLoading = ref<boolean>(false);
// const formPort = reactive({
//     asset_id: Number(assetId),
//     name: undefined,
//     description: undefined,
//     ratio: undefined
// })

// const resetForm = () => {
//     formPort.name = undefined;
//     formPort.description = undefined;
//     formPort.ratio = undefined;
// }

// const onCloseModal = () => {
//     resetForm();
//     visible.value = false;
// }

// const addPort = async () => {
//     const { $api } = useNuxtApp()
//     isLoading.value = true;
//     try {
//         const response = await $api(`/api/ports`, {
//             method: 'POST',
//             body: formPort
//         })

//         if (response.success) {
//             onCloseModal();
//             await stockStore.fetchAssets();
//         }
//     } catch (error) {
//         console.error('Failed to add port', error)
//     } finally {
//         isLoading.value = false;
//     }
// };

// const updateAsset = async () => {
//     const { $api } = useNuxtApp()
//     isLoading.value = true;
//     try {
//         const response = await $api(`/api/assets/${assetId}`, {
//             method: 'PUT',
//             body: form
//         })

//         if (response.success) {
//             onCloseModal();
//             await fetchAsset();
//         }
//     } catch (error) {
//         console.error('Failed to update port', error)
//     } finally {
//         isLoading.value = false;
//     }
// };
</script>

<template>
    <header class="flex justify-between items-center">
        <UiButtonBack to="/" label="Back to Assets" />
        <UiButtonFloat label="Add Port" @click="visible = true" />
    </header>

    <div class="flex justify-between items-start">
        <h2 class="text-2xl font-bold">{{ asset?.name }} <span class="text-gray-500 text-sm">({{ asset?.ports?.length
        }})</span></h2>
        <!-- <div>Value: <span class="font-bold text-primary">{{ formatNumber(asset?.value || 0) }}</span></div> -->
    </div>

    <!-- <div class="flex justify-between items-center">
        <div class="text-xs">Cost: <span class="font-bold text-blue-400">{{ formatNumber(asset?.cost || 0) }}</span>
        </div>
        <div class="text-xs">Profit: <span
                :class="{ 'text-green-500': asset?.profitPercentage > 0, 'text-red-500': asset?.profitPercentage < 0 }">{{
                    formatNumber(asset?.profitAmount || 0) }} ({{ formatNumber(asset?.profitPercentage || 0, 2) }}%)</span>
        </div>
    </div> -->

    <hr class="my-2">

    <PortEmpty title="No Sub Portfolios" description="Add a sub portfolio to get started" v-if="ports?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>Portfolio ratio: </div>
            <!-- <div class="text-xs">{{ formatNumber(assetsRatio || 0) }}/100%</div> -->
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="port in ports" :key="port.id">
                <PortCard :port="port" :asset="asset" @edit="onEditPort(port)" @delete="onDeletePort(port)" />
            </div>
        </div>
    </template>

    <PortModalForm v-model:visible="visible" :asset-id="assetId" :port="editingPort" @close="onCloseModal"
        @update:ports="onUpdatePorts" />
</template>