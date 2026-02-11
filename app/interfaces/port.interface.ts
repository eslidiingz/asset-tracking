import type { Stock } from "./stock.interface";

export interface Port {
    id: string;
    asset_id: string;
    name: string;
    description: string;
    ratio: number;
    sequence: number;
    cost?: number;
    profitAmount?: number;
    profitPercentage?: number;
    value?: number;
    stocks?: Stock[];
}