import { asc, eq } from "drizzle-orm";
import { stocksTable } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const portId = Number(getRouterParam(event, 'id'));
    const stocks = await useDrizzle().select().from(stocksTable)
        .where(eq(stocksTable.port_id, portId))
        .orderBy(asc(stocksTable.id))
        .all()

    return {
        success: true,
        message: "Get stocks successfully",
        data: stocks
    };
})