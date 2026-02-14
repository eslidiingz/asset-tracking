import type { ApiResponse } from "~/interfaces/api.interface"
import type { Port } from "~/interfaces/port.interface"

export const usePort = () => {
    const { $api } = useNuxtApp()
    const isLoading = ref<boolean>(false)
    const ports = ref<Port[]>([])
    const port = ref<Port | null>(null)

    const fetchPorts = async () => {
        isLoading.value = true;
        try {
            // ระบุ generic type ให้ $api เพื่อลดความซับซ้อนของ type inference
            const response = await $api<ApiResponse>('/api/ports')
            ports.value = response.data
        } catch (error) {
            console.error('Failed to fetch ports', error)
        } finally {
            isLoading.value = false;
        }
    }

    const addPort = async (newPort: Port) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>('/api/ports', {
                method: 'POST',
                body: newPort
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

    const updatePort = async (updatedPort: Port) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>(`/api/ports/${updatedPort.id}`, {
                method: 'PUT',
                body: updatedPort
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

    const deletePort = async (portToDelete: Port) => {
        isLoading.value = true;
        try {
            const response = await $api<ApiResponse>(`/api/ports/${portToDelete.id}`, {
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
        ports,
        port,
        fetchPorts,
        addPort,
        findPort,
        updatePort,
        deletePort,
    }
}