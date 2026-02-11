import { eq } from "drizzle-orm";
import z from "zod";
import { stocksTable } from "~~/server/database/schema";

const schema = z.object({
    port_id: z.number(),
    symbol: z.string(),
    amount: z.number(),
    cost: z.number(),
    ratio: z.number().optional(),
})

export default defineEventHandler(async (event) => {
    const stockId = Number(getRouterParam(event, 'id'));
    const validated = await readValidatedBody(event, body => schema.safeParse(body));

    if (!validated.success) {
        return {
            success: false,
            message: "Some fields are missing",
            data: null
        }
    }

    const stock: typeof stocksTable.$inferInsert = validated.data
    
    const stockUpdated = useDrizzle().update(stocksTable)
        .set(stock)
        .where(eq(stocksTable.id, stockId))
        .returning()
        .get();

    return {
        success: true,
        message: "Update stock successfully",
        data: stockUpdated
    };
})