import { desc, eq } from "drizzle-orm"
import { stocksTable, portsTable } from "~~/server/database/schema"

export default defineEventHandler(async (event) => {
    const ports = useDrizzle().select().from(portsTable)
        .orderBy(desc(portsTable.ratio))
        .all()
    console.log('PORTS', ports)
    return {
        success: true,
        message: 'Get ports successfully',
        data: ports
    }
})