import type { Stock } from "./stock.interface";

export interface Port {
    id: number;
    asset_id: number;
    name: string | null;
    description: string | null;
    ratio: number | null;
    sequence: number | null;
    cost?: number;
    profitAmount?: number;
    profitPercentage?: number;
    value?: number;
    stocks?: Stock[];
}