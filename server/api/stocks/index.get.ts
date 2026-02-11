import { stocksTable } from "~~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const { port_id: portId } = getQuery(event)
    
    const stocks = useDrizzle().select().from(stocksTable)
        .where(eq(stocksTable.port_id, Number(portId)))
        .all()

    return {
        success: true,
        message: 'Stocks fetched successfully',
        data: stocks
    }
})