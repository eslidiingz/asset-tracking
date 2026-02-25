import type { PriceList, Stock } from "~/interfaces/stock.interface"
import type { Port } from "~/interfaces/port.interface"

interface Asset {
    id: number
    name: string
    currency: string | null
    description: string
    ratio: number
    sequence: number
    cost?: number
    value?: number
    profit_amount?: number
    profit_percentage?: number
    ports: Port[]
}

export const useStockStore = defineStore('stock', () => {
    const priceList = ref<PriceList[]>([])
    const assets = ref<Asset[]>([])

    const fetchPriceList = async () => {
        if (priceList.value.length > 0) return

        const result = await $fetch(`https://script.google.com/macros/s/AKfycbzuqFKPuH_g9ySbQGii4gu_YdQG0mh9n5sVfSKENfzb3sg0uWlsqSYJ8azb_Pf2kgezsw/exec`);

        priceList.value = result as PriceList[]
    }

    const fetchAssets = async () => {
        const { $api } = useNuxtApp()
        await fetchPriceList()

        const result = await $api(`/api/assets`);

        const _assets = result?.data as Asset[]

        assets.value = _assets.map((asset) => {
            const ports = asset.ports.map((port) => {
                const stocks = (port.stocks || []).map((stock) => {
                    return {
                        ...stock,
                        price: stockPrice(stock),
                        total_cost: stockTotalCost(stock),
                        value: stockValue(stock),
                        profit_amount: stockProfitAmount(stock),
                        profit_percentage: stockProfitPercentage(stock)
                    }
                })

                return {
                    ...port,
                    cost: portTotalCost(port),
                    value: portValue(port),
                    profit_amount: portProfitAmount(port),
                    profit_percentage: portProfitPercentage(port),
                    stocks
                }
            })

            const cost = assetTotalCost(ports)
            const value = assetValue(ports)
            const profit_amount = assetProfitAmount(ports)
            const profit_percentage = assetProfitPercentage(ports)

            return {
                ...asset,
                cost,
                value,
                profit_amount,
                profit_percentage,
                ports
            }
        })
    }

    const assetTotalCost = (ports: Port[]) => ports.reduce((acc, port) => acc + (port?.cost || 0), 0)
    const assetValue = (ports: Port[]) => ports.reduce((acc, port) => acc + (port?.value || 0), 0)
    const assetProfitAmount = (ports: Port[]) => assetValue(ports) - assetTotalCost(ports)
    const assetProfitPercentage = (ports: Port[]) => assetTotalCost(ports) > 0 ? (assetProfitAmount(ports) / assetTotalCost(ports)) * 100 : 0

    const portTotalCost = (port: Port) => (port.stocks || []).reduce((acc, stock) => acc + (stock.cost * stock.amount), 0)
    const portValue = (port: Port) => {
        return (port.stocks || []).reduce((acc, stock) => acc + (stock.value || stockPrice(stock) * stock.amount), 0)
    }

    const portProfitAmount = (port: Port) => portValue(port) - portTotalCost(port)
    const portProfitPercentage = (port: Port) => portTotalCost(port) > 0 ? (portProfitAmount(port) / portTotalCost(port) * 100) : 0

    const stockPrice = (stock: Stock) => {
        switch (stock.type) {
            case 'stock':
                return priceList.value.find((price) => price.symbol === stock.symbol)?.price || 0
            default:
                return stock.price || 0
        }
    }
    const stockTotalCost = (stock: Stock) => stock.total_cost || stock.cost * stock.amount
    const stockValue = (stock: Stock) => stock.value || stockPrice(stock) * stock.amount
    const stockProfitAmount = (stock: Stock) => stockValue(stock) - stockTotalCost(stock)
    const stockProfitPercentage = (stock: Stock) => stockTotalCost(stock) > 0 ? (stockProfitAmount(stock) / stockTotalCost(stock) * 100) : 0

    const usdRate = computed(() => priceList.value.find(p => p.symbol === 'USD')?.price || 1)

    const currentRatio = (value: number, totalValue: number) => totalValue > 0 ? (value / totalValue) * 100 : 0

    return {
        priceList,
        assets,

        fetchPriceList,
        fetchAssets,
        currentRatio,
        portValue,
        usdRate
    }
})