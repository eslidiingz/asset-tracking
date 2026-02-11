import { portsTable, stocksTable } from "~~/server/database/schema";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const assetId = Number(getRouterParam(event, 'id'));

    const ports = await useDrizzle().query.portsTable.findMany({
        where: eq(portsTable.asset_id, assetId),
        orderBy: desc(portsTable.ratio),
        with: {
            stocks: true
        }
    })

    return {
        success: true,
        message: "Get ports successfully",
        data: ports
    }
})