import type { Stock } from "./stock.interface";

export interface Port {
    id: number;
    asset_id: number;
    name: string | null;
    description: string | null;
    ratio: number | null;
    sequence: number | null;
    cost?: number;
    profit_amount?: number;
    profit_percentage?: number;
    value?: number;
    stocks?: Stock[];
}