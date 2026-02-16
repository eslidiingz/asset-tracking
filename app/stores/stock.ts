import type { PriceList } from "~/interfaces/stock.interface"

interface Asset {
    id: number
    name: string
    description: string
    ratio: number
    sequence: number
    cost?: number
    value?: number
    profitAmount?: number
    profitPercentage?: number
    ports: Port[]
}

interface Port {
    id: number
    asset_id: number
    name: string
    description: string
    ratio: number
    sequence: number
    cost?: number
    value?: number
    profitAmount?: number
    profitPercentage?: number
    stocks: Stock[]
}

interface Stock {
    id: number
    port_id: number
    symbol: string
    amount: number
    cost: number
    ratio: number
    price?: number
    totalCost?: number
    value?: number
    profitAmount?: number
    profitPercentage?: number
}

export const useStockStore = defineStore('stock', () => {
    const priceList = ref<PriceList[]>([])
    const assets = ref<Asset[]>([])

    const asset = ref<Asset | null>(null)

    const fetchPriceList = async () => {
        if (priceList.value.length > 0) return

        const result = await $fetch(`https://script.google.com/macros/s/AKfycbzuqFKPuH_g9ySbQGii4gu_YdQG0mh9n5sVfSKENfzb3sg0uWlsqSYJ8azb_Pf2kgezsw/exec`);

        priceList.value = result as PriceList[]
    }

    const fetchAssets = async () => {
        const { $api } = useNuxtApp()
        await fetchPriceList()

        if (assets.value.length > 0) return

        const result = await $api(`/api/assets`);

        const _assets = result?.data as Asset[]

        assets.value = _assets.map((asset) => {
            const ports = asset.ports.map((port) => {
                const stocks = port.stocks.map((stock) => {
                    return {
                        ...stock,
                        price: stockPrice(stock),
                        totalCost: stockTotalCost(stock),
                        value: stockValue(stock),
                        profitAmount: stockProfitAmount(stock),
                        profitPercentage: stockProfitPercentage(stock)
                    }
                })

                return {
                    ...port,
                    cost: portTotalCost(port),
                    value: portValue(port),
                    profitAmount: portProfitAmount(port),
                    profitPercentage: portProfitPercentage(port),
                    stocks
                }
            })

            const cost = assetTotalCost(ports)
            const value = assetValue(ports)
            const profitAmount = assetProfitAmount(ports)
            const profitPercentage = assetProfitPercentage(ports)

            return {
                ...asset,
                cost,
                value,
                profitAmount,
                profitPercentage,
                ports
            }
        })
    }

    const assetTotalCost = (ports: Port[]) => ports.reduce((acc, port) => acc + (port?.cost || 0), 0)
    const assetValue = (ports: Port[]) => ports.reduce((acc, port) => acc + (port?.value || 0), 0)
    const assetProfitAmount = (ports: Port[]) => assetValue(ports) - assetTotalCost(ports)
    const assetProfitPercentage = (ports: Port[]) => assetTotalCost(ports) > 0 ? (assetProfitAmount(ports) / assetTotalCost(ports)) * 100 : 0

    const portTotalCost = (port: Port) => port.stocks.reduce((acc, stock) => acc + stock.cost * stock.amount, 0)
    const portValue = (port: Port) => port.stocks.reduce((acc, stock) => acc + stockValue(stock), 0)

    const portProfitAmount = (port: Port) => portValue(port) - portTotalCost(port)
    const portProfitPercentage = (port: Port) => portProfitAmount(port) / portTotalCost(port) * 100

    const stockPrice = (stock: Stock) => priceList.value.find((price) => price.symbol === stock.symbol)?.price || 0
    const stockTotalCost = (stock: Stock) => stock.cost * stock.amount
    const stockValue = (stock: Stock) => stockPrice(stock) * stock.amount
    const stockProfitAmount = (stock: Stock) => stockValue(stock) - stockTotalCost(stock)
    const stockProfitPercentage = (stock: Stock) => stockProfitAmount(stock) / stockTotalCost(stock) * 100

    const currentRatio = (value: number, totalValue: number) => totalValue > 0 ? (value / totalValue) * 100 : 0

    return {
        priceList,
        assets,
        fetchPriceList,
        fetchAssets,
        currentRatio
    }
})