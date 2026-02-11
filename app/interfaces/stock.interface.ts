export interface Stock {
    id: string;
    port_id: number;
    symbol: string;
    amount: number;
    cost: number;
    sequence: number;
    ratio: number;
    price?: number;
    totalCost?: number;
    profitAmount?: number;
    profitPercentage?: number;
    value?: number;
}

export interface PriceList {
    id: string;
    symbol: string;
    price: number;
}

export interface StockForm {
    id?: number,
    port_id?: number,
    symbol?: string,
    amount?: number,
    cost?: number,
    ratio?: number
}