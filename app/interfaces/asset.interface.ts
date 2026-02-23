import type { Port } from "./port.interface";

export interface Asset {
    id: number;
    user_id?: number;
    name: string | null;
    currency: string | null;
    description: string | null;
    ratio: number | null;
    sequence: number | null;
    profit_amount?: number;
    profit_percentage?: number;
    cost?: number;
    value?: number;
    ports?: Port[];
}