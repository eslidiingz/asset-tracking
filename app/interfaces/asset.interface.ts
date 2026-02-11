import type { Port } from "./port.interface";

export interface Asset {
    id: string;
    name: string;
    description: string;
    ratio: number;
    sequence: number;
    profitAmount?: number;
    profitPercentage?: number;
    cost?: number;
    value?: number;
    ports?: Port[];
}