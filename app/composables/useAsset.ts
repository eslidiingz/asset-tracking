import type { Asset } from "~/interfaces/asset.interface";

export const useAsset = () => {
    const { $api } = useNuxtApp()
    const isLoading: Ref<boolean> = ref<boolean>(false);
    const form = reactive<Omit<Asset, 'id' | 'user_id' | 'sequence'>>({
        name: null,
        currency: 'usd',
        description: null,
        ratio: null
    })
    const { assets } = storeToRefs(useAssetStore())

    const resetForm = () => {
        Object.assign(form, {
            name: null,
            description: null,
            ratio: null,
            currency: 'usd'
        })
    }

    const fetchAssets = async () => {
        isLoading.value = true;
        try {
            const response = await $api<{ success: boolean, data: Asset[] }>(`/api/assets`)

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
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets`, {
                method: 'POST' as any,
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

    const findAsset = async (id: string | number) => {
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets/${id}`)

            if (response.success) {
                // asset.value = response.data;
                return response.data;
            }
        } catch (error) {
            console.error('Failed to find asset', error)
        } finally {
            isLoading.value = false;
        }
    }

    const updateAsset = async (id: string | number) => {
        isLoading.value = true;
        try {
            const response = await $api(`/api/assets/${id}`, {
                method: 'PUT' as any,
                body: form
            })

            if (response.success) {
                // await fetchAssets();
            }
        } catch (error) {
            console.error('Failed to update asset', error)
        } finally {
            isLoading.value = false;
        }
    }

    const deleteAsset = async (id: string | number) => {
        isLoading.value = true;
        try {
            await $api(`/api/assets/${id}`, {
                method: 'DELETE' as any
            })

            return { success: true }
        } catch (error: any) {
            console.error('Failed to delete asset', error)

            if (error.data) {
                return { ...error.data, success: false }
            }

            return { success: false, message: 'Failed to delete asset' }
        } finally {
            isLoading.value = false;
        }
    }

    const setForm = (asset: Asset) => {
        form.name = asset.name;
        form.description = asset.description;
        form.ratio = asset.ratio;
    }

    return {
        isLoading,
        form,

        fetchAssets,
        createAsset,
        findAsset,
        updateAsset,
        deleteAsset,
        resetForm,
        setForm,
    }
}