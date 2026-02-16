import type { Port } from "./port.interface";

export interface Asset {
    id: number;
    user_id: number;
    name: string | null;
    description: string | null;
    ratio: number | null;
    sequence: number | null;
    profitAmount?: number;
    profitPercentage?: number;
    cost?: number;
    value?: number;
    ports?: Port[];
}