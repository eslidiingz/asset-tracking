export interface Stock {
    id: number;
    port_id: number;
    symbol: string;
    amount: number;
    cost: number;
    sequence: number | null;
    ratio: number | null;
    price?: number;
    totalCost?: number;
    profitAmount?: number;
    profitPercentage?: number;
    value?: number;
}

export interface PriceList {
    id: number;
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