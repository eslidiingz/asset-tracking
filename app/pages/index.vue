<script setup>
const stockStore = useStockStore()
const { assets } = storeToRefs(stockStore)
const { currentRatio } = stockStore

await stockStore.fetchAssets()
await stockStore.fetchPriceList()

const assetsRatio = computed(() => assets.value.reduce((acc, port) => acc + port.ratio, 0))
const remainingRatio = computed(() => 100 - assetsRatio.value)

const assetTotalValue = computed(() => assets.value.reduce((acc, item) => acc + item.value, 0))

const visible = ref(false);
const isLoading = ref(false);
const form = reactive({
    name: undefined,
    description: undefined,
    ratio: null
})

const resetForm = () => {
    form.name = undefined;
    form.description = undefined;
    form.ratio = null;
}

const onCloseModal = () => {
    resetForm();
    visible.value = false;
}

const addPortfolio = async () => {
    isLoading.value = true;
    try {
        const response = await $fetch(`/api/assets`, {
            method: 'POST',
            body: form
        })

        if (response.success) {
            onCloseModal();
            await fetchAssets();
        }
    } catch (error) {
        console.error('Failed to create portfolio', error)
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex justify-between items-center mb-3">
        <h2 class="text-2xl font-bold">My Assets</h2>
        <div>Value: <span class="font-bold text-primary">{{ formatNumber(assetTotalValue) }}</span></div>

        <Button @click="visible = true" v-if="remainingRatio > 0">
            <Icon name="lucide:plus" />
            <span>Add Asset</span>
        </Button>
    </div>

    <hr class="my-2">

    <PortEmpty v-if="assets?.length === 0" />

    <template v-else>
        <div class="flex justify-between items-center mb-1">
            <div>Assets ratio: </div>
            <div class="text-xs">{{ formatNumber(assetsRatio) }}/100%</div>
        </div>

        <div class="space-y-2 mb-6">
            <div v-for="asset in assets" :key="asset.id">
                <CardAsset :asset="asset" />
            </div>
        </div>
    </template>


    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal header="Add Asset" class="w-full max-w-md mx-4" @hide="onCloseModal">
            <Form @submit="addPortfolio">
                <div class="mb-6">
                    <div class="flex flex-col mb-2">
                        <InputText name="name" type="text" placeholder="Asset Name" required v-model="form.name" />
                    </div>
                    <div class="flex flex-col mb-2">
                        <InputText name="description" type="text" placeholder="Description"
                            v-model="form.description" />
                    </div>
                    <div class="flex flex-col mb-2">
                        <InputText name="ratio" type="number" placeholder="Ratio" v-model.number="form.ratio"
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
