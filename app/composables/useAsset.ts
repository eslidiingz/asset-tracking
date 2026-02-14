import type { Asset } from "~/interfaces/asset.interface";

export const useAsset = () => {
    const isLoading: Ref<boolean> = ref<boolean>(false);
    const form: Asset = reactive({})
    const { assets } = storeToRefs(useAssetStore())

    const resetForm = () => {
        form.name = undefined;
        form.description = undefined;
        form.ratio = undefined;
    }

    const fetchAssets = async () => {
        const { $api } = useNuxtApp()
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets`)

            if (response.success) {
                assets.value = response.data;
            }
        } catch (error) {
            console.error('Failed to fetch assets', error)
        } finally {
            isLoading.value = false;
        }
    }

    const createAsset = async () => {
        const { $api } = useNuxtApp()
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets`, {
                method: 'POST',
                body: form
            })

            if (response.success) {
                // await fetchAssets();
            }
        } catch (error) {
            console.error('Failed to create portfolio', error)
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        form,

        fetchAssets,
        createAsset,
        resetForm,
    }
}