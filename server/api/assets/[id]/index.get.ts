import { assetsTable, portsTable } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const assetId = Number(getRouterParam(event, 'id'));
    const asset = await useDrizzle().query.assetsTable.findFirst({
        where: eq(assetsTable.id, assetId),
        with: {
            ports: {
                with: {
                    stocks: true
                }
            }
        }
    })
    
    return {
        success: true,
        message: "Find asset successfully",
        data: asset
    }
})