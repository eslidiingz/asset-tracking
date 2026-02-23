export interface Stock {
    id: number;
    port_id: number;
    type?: 'stock' | 'fund' | 'crypto';
    symbol: string;
    amount: number;
    cost: number;
    total_cost: number;
    price: number;
    value: number | null;
    sequence: number | null;
    ratio: number | null;
    profit_amount?: number;
    profit_percentage?: number;
}

export interface PriceList {
    id: number;
    symbol: string;
    price: number;
}

export interface StockForm {
    id?: number;
    port_id?: number;
    type?: 'stock' | 'fund' | 'crypto';
    symbol?: string;
    amount?: number;
    cost?: number;
    total_cost?: number;
    price?: number;
    value?: number | null;
    ratio?: number | null;
}