import { assetsTable, portsTable } from "~~/server/database/schema"
import { eq, desc } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);

    const ports = await useDrizzle().select({
        id: portsTable.id,
        name: portsTable.name,
        description: portsTable.description,
        ratio: portsTable.ratio,
        asset_id: portsTable.asset_id,
        sequence: portsTable.sequence
    })
        .from(portsTable)
        .innerJoin(assetsTable, eq(portsTable.asset_id, assetsTable.id))
        .where(eq(assetsTable.user_id, userId))
        .orderBy(desc(portsTable.ratio))
        .all()

    return {
        success: true,
        message: 'Get ports successfully',
        data: ports
    }
})