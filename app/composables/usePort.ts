import type { ApiResponse } from "~/interfaces/api.interface"
import type { Port } from "~/interfaces/port.interface"

export const usePort = () => {
    const { $api } = useNuxtApp()
    const isLoading = ref<boolean>(false)
    const form = reactive<Port>({
        id: undefined as any, // Will be set on edit
        asset_id: undefined as any,
        name: null,
        description: null,
        ratio: null,
        sequence: null
    })

    const ports = ref<Port[]>([])
    const port = ref<Port | null>(null)

    const resetForm = () => {
        form.name = null
        form.description = null
        form.ratio = null
        form.sequence = null
    }

    const setForm = (p: Port) => {
        form.name = p.name
        form.description = p.description
        form.ratio = p.ratio
    }

    const fetchPorts = async (assetId?: number) => {
        isLoading.value = true;
        try {
            const uri = assetId ? `/api/ports?asset_id=${assetId}` : `/api/ports`
            const response = await $api<ApiResponse>(uri)
            ports.value = response.data
        } catch (error) {
            console.error('Failed to fetch ports', error)
        } finally {
            isLoading.value = false;
        }
    }

    const createPort = async (assetId: number | string) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>('/api/ports', {
                method: 'POST',
                body: {
                    ...form,
                    asset_id: Number(assetId)
                }
            })

            if (response.success) {
                await fetchPorts();
            }
            return response;
        } catch (error: any) {
            console.error('Failed to add port', error)
            return error.data
        } finally {
            isLoading.value = false;
        }
    }

    const findPort = async (id: number | string) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>(`/api/ports/${id}`)
            port.value = response.data
        } catch (error) {
            console.error('Failed to fetch port', error)
        } finally {
            isLoading.value = false;
        }
    }

    const updatePort = async (id: number) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>(`/api/ports/${id}`, {
                method: 'PUT',
                body: form
            })

            if (response.success) {
                await fetchPorts();
            }
            return response;
        } catch (error: any) {
            console.error('Failed to update port', error)
            return error.data
        } finally {
            isLoading.value = false;
        }
    }

    const deletePort = async (id: number) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>(`/api/ports/${id}`, {
                method: 'DELETE'
            })

            if (response.success) {
                await fetchPorts();
            }
            return response;
        } catch (error: any) {
            console.error('Failed to delete port', error)
            return error.data
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        form,
        ports,
        port,

        fetchPorts,
        createPort,
        findPort,
        updatePort,
        deletePort,
        resetForm,
        setForm,
    }
}