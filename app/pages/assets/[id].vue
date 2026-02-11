<script setup>
const route = useRoute();
const assetId = route.params.id;

const stockStore = useStockStore();
const { currentRatio } = stockStore;
const { assets } = storeToRefs(stockStore);

const asset = computed(() => assets.value.find((asset) => asset.id === Number(assetId)))
const assetsRatio = computed(() => asset.value?.ports.reduce((acc, port) => acc + port.ratio, 0))
const remainingRatio = computed(() => 100 - assetsRatio.value)

const visible = ref(false);
const isLoading = ref(false);
const formPort = reactive({
    asset_id: Number(assetId),
    name: undefined,
    description: undefined,
    ratio: undefined
})

const resetForm = () => {
    formPort.name = undefined;
    formPort.description = undefined;
    formPort.ratio = undefined;
}

const onCloseModal = () => {
    resetForm();
    visible.value = false;
}

const addPort = async () => {
    isLoading.value = true;
    try {
        const response = await $fetch(`/api/ports`, {
            method: 'POST',
            body: formPort
        })

        if (response.success) {
            onCloseModal();
            await stockStore.fetchAssets();
        }
    } catch (error) {
        console.error('Failed to add port', error)
    } finally {
        isLoading.value = false;
    }
};

const updateAsset = async () => {
    isLoading.value = true;
    try {
        const response = await $fetch(`/api/assets/${assetId}`, {
            method: 'PUT',
            body: form
        })

        if (response.success) {
            onCloseModal();
            await fetchAsset();
        }
    } catch (error) {
        console.error('Failed to update port', error)
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex justify-between items-center">
        <NuxtLink to="/" class="btn-back">
            <Icon name="lucide:chevron-left" />
            <span>Back to Assets</span>
        </NuxtLink>
        <Button @click="visible = true" v-if="remainingRatio > 0">
            <Icon name="lucide:plus" />
            <span>Add Port</span>
        </Button>
    </div>
    
    <div class="flex justify-between items-start">
        <h2 class="text-2xl font-bold">{{ asset?.name }} <span class="text-gray-500 text-sm">({{ asset?.ports?.length }})</span></h2>
        <div>Value: <span class="font-bold text-primary">{{ formatNumber(asset?.value) }}</span></div>
    </div>
        
    <div class="flex justify-between items-center">
        <div class="text-xs">Cost: <span class="font-bold text-blue-400">{{ formatNumber(asset?.cost) }}</span></div>
        <div class="text-xs">Profit: <span :class="{ 'text-green-500': asset?.profitPercentage > 0, 'text-red-500': asset?.profitPercentage < 0 }">{{ formatNumber(asset?.profitAmount) }} ({{ formatNumber(asset?.profitPercentage, 2) }}%)</span></div>
    </div>

    <hr class="my-2">

    <PortEmpty title="No Sub Portfolios" description="Add a sub portfolio to get started" v-if="ports?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>Portfolio ratio: </div>
            <div class="text-xs">{{ formatNumber(assetsRatio) }}/100%</div>
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="port in asset?.ports" :key="port.id">
                <CardPort :port="port" :asset="asset" />
            </div>
        </div>
    </template>

    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal header="Add Port" class="w-full max-w-md mx-4"
            @hide="onCloseModal">
            <Form @submit="addPort">
                <div class="mb-6">
                    <div class="flex flex-col mb-2">
                        <InputText name="name" type="text" placeholder="Portfolio Name" required v-model="formPort.name" />
                    </div>
                    <div class="flex flex-col mb-2">
                        <InputText name="description" type="text" placeholder="Description"
                            v-model="formPort.description" />
                    </div>
                    <div class="flex flex-col mb-2">
                        <InputText name="ratio" type="number" placeholder="Ratio" v-model.number="formPort.ratio"
                            :max="remainingRatio" min="0.1" step="0.1" />
                        <small class="text-xs text-gray-600 my-1">Remaining ratio: {{ remainingRatio }}%</small>
                    </div>
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="onCloseModal"></Button>
                    <Button type="submit">
                        <Icon name="lucide:save" />
                        <span>Save</span>
                    </Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>