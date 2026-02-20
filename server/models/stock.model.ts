import z from "zod";
import { and, eq } from "drizzle-orm";
import { stocksTable } from "../database/schema";

export const stockSchema = z.object({
    id: z.number().optional(),
    port_id: z.number(),
    symbol: z.string(),
    amount: z.number(),
    cost: z.number(),
    ratio: z.number().optional().nullable(),
})

export type Stock = z.infer<typeof stockSchema>

export default class StockModel {
    async get() {
        return await useDrizzle().query.stocksTable.findMany()
    }

    async create(stock: Stock) {
        return await useDrizzle().insert(stocksTable).values(stock).returning().get()
    }

    async find(id: number) {
        return await useDrizzle().query.stocksTable.findFirst({
            where: eq(stocksTable.id, id)
        })
    }

    async update(id: number, stock: Stock) {
        return await useDrizzle().update(stocksTable)
            .set(stock)
            .where(eq(stocksTable.id, id))
            .returning()
            .get();
    }

    async delete(id: number) {
        return await useDrizzle().delete(stocksTable).where(eq(stocksTable.id, id))
    }

    async symbolExist(portId: number, symbol: string) {
        const result = await useDrizzle().select()
            .from(stocksTable)
            .where(
                and(
                    eq(stocksTable.port_id, portId),
                    eq(stocksTable.symbol, symbol)
                )
            ).get();
        return !!result
    }
}