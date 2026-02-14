import type { Asset } from "~/interfaces/asset.interface";

export const useAssetStore = defineStore('asset', () => {
    const assets: Ref<Asset[]> = ref<Asset[]>([]);


    const currentRatio = ref(0);
    const remainingRatio = ref(0);
    const assetTotalValue = ref(0);
    const visible = ref(false);
    const isLoading = ref(false);
    const form = reactive<Asset>({
        name: undefined,
        description: undefined,
        ratio: undefined
    })


    const resetForm = () => {
        form.name = undefined;
        form.description = undefined;
        form.ratio = undefined;
    }

    const onCloseModal = () => {
        resetForm();
        visible.value = false;
    }

    const addPortfolio = async () => {
        const { $api } = useNuxtApp()
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets`, {
                method: 'POST',
                body: form
            })

            if (response.success) {
                onCloseModal();
                // await fetchAssets();
            }
        } catch (error) {
            console.error('Failed to create portfolio', error)
        } finally {
            isLoading.value = false;
        }
    };


    return {
        assets
    }
})