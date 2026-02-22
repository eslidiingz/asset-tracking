import { stocksTable } from "~~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const { port_id: portId } = getQuery(event)

    const stocks = await useDrizzle().select().from(stocksTable)
        .where(eq(stocksTable.port_id, Number(portId)))
        .all()

    return {
        success: true,
        message: 'ค้นหาหุ้นสำเร็จ',
        data: stocks
    }
})