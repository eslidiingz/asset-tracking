<script setup lang="ts">
const route = useRoute();
const assetId = route.params.id as string;
import type { Port } from '~/interfaces/port.interface';

// States
const visible = ref<boolean>(false);
const editingPort = ref<Port | null>(null);

// Composables
const { deletePort } = usePort();
const { requireDelete } = useAppConfirm();

// Stores
const stockStore = useStockStore();
const { assets } = storeToRefs(stockStore)

// Computed
const asset = computed(() => assets.value.find((asset) => asset.id === Number(assetId)))
const ports = computed(() => asset.value?.ports)

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
            stockStore.fetchAssets();
        }
        return result
    }, 'Portfolio has been deleted')
}

const onUpdatePorts = async () => {
    stockStore.fetchAssets();;
}

const onCloseModal = () => {
    visible.value = false;
    editingPort.value = null;
}
</script>

<template>
    <AssetHeader v-if="asset" :asset="asset" @add-port="visible = true" />

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

    <UiButtonFloat label="Add Port" @click="visible = true" />
    <PortModalForm v-model:visible="visible" :asset-id="assetId" :port="editingPort" @close="onCloseModal"
        @update:ports="onUpdatePorts" />
</template>