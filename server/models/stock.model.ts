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
    get() {
        return useDrizzle().query.stocksTable.findMany()
    }

    create(stock: Stock) {
        return useDrizzle().insert(stocksTable).values(stock).returning().get()
    }

    find(id: number) {
        return useDrizzle().query.stocksTable.findFirst({
            where: eq(stocksTable.id, id)
        })
    }

    update(id: number, stock: Stock) {
        return useDrizzle().update(stocksTable)
            .set(stock)
            .where(eq(stocksTable.id, id))
            .returning()
            .get();
    }

    delete(id: number) {
        return useDrizzle().delete(stocksTable).where(eq(stocksTable.id, id))
    }

    symbolExist(portId: number, symbol: string) {
        return useDrizzle().select()
            .from(stocksTable)
            .where(
                and(
                    eq(stocksTable.port_id, portId),
                    eq(stocksTable.symbol, symbol)
                )
            ).get();
    }
}