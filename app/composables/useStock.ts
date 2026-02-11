import type { ApiResponse } from "~/interfaces/api.interface"
import type { PriceList, Stock, StockForm } from "~/interfaces/stock.interface"

// Shared State
const isLoading = ref<boolean>(false)
const stocks = ref<Stock[]>([])
const form = reactive<StockForm>({})
const isEditMode = ref<boolean>(false)

export const useStock = () => {
    // Store
    const stockStore = useStockStore()

    // Computed
    const ratio = computed(() => stocks.value.reduce((acc, stock) => acc + stock.ratio, 0))
    const remainingRatio = computed(() => 100 - ratio.value)

    // Methods
    const fetchStocks = async (portId?: number) => {
        const queryString = portId ? `?port_id=${portId}` : ''

        isLoading.value = true;
        try {
            const { data }: ApiResponse = await $fetch(`/api/stocks${queryString}`)
            stocks.value = data

        } catch (error) {
            console.error('Failed to add stock', error)
        } finally {
            await fetchPriceList()
            isLoading.value = false;
        }
    }

    const addStock = async (stock: Stock) => {
        isLoading.value = true;
        try {
            const response: ApiResponse = await $fetch(`/api/stocks`, {
                method: 'POST',
                body: stock
            })

            if (response.success) {
                await fetchStocks(stock.port_id);
            }
            return response;
        } catch (error: any) {
            console.error('Failed to add stock', error)
            return error.data || { success: false, message: 'Failed to add stock' }
        } finally {
            isLoading.value = false;
        }
    }

    const updateStock = async (stock: Stock) => {
        isLoading.value = true;
        try {
            const response: ApiResponse = await $fetch(`/api/stocks/${stock.id}`, {
                method: 'PUT',
                body: stock
            })

            if (response.success) {
                await fetchStocks(stock.port_id);
            }
            return response;
        } catch (error: any) {
            console.error('Failed to update stock', error)
            return error.data || { success: false, message: 'Failed to update stock' }
        } finally {
            isLoading.value = false;
        }
    }

    const fetchPriceList = async () => {
        if (stockStore.priceList.length > 0) return

        try {
            const result = await $fetch(`https://script.google.com/macros/s/AKfycbzuqFKPuH_g9ySbQGii4gu_YdQG0mh9n5sVfSKENfzb3sg0uWlsqSYJ8azb_Pf2kgezsw/exec`)
            stockStore.priceList = result as PriceList[]
        } catch (error) {
            console.error('Failed to fetch price list', error)
        }
    }

    const deleteStock = async (stock: Stock) => {
        isLoading.value = true;
        try {
            const response: ApiResponse = await $fetch(`/api/stocks/${stock.id}`, {
                method: 'DELETE'
            })

            if (response.success) {
                await fetchStocks(stock.port_id);
            }
        } catch (error) {
            console.error('Failed to delete stock', error)
        } finally {
            isLoading.value = false;
        }
    }

    const resetForm = () => {
        form.id = undefined;
        form.port_id = undefined;
        form.symbol = undefined;
        form.amount = undefined;
        form.cost = undefined;
        form.ratio = undefined;
    }

    const findSymbol = (symbol: string) => stockStore.priceList.find(s => s.symbol === symbol)

    return {
        isLoading,
        stocks,
        ratio,
        remainingRatio,
        isEditMode,
        form,

        fetchStocks,
        addStock,
        updateStock,
        fetchPriceList,
        deleteStock,
        resetForm,
        findSymbol
    }
}