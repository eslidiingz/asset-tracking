import { assetsTable } from "~~/server/database/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);

    const assetId = Number(getRouterParam(event, 'id'));
    const asset = await useDrizzle().query.assetsTable.findFirst({
        where: and(
            eq(assetsTable.id, assetId),
            eq(assetsTable.user_id, userId)
        ),
        with: {
            ports: {
                with: {
                    stocks: true
                }
            }
        }
    })

    if (!asset) {
        throw createError({
            statusCode: 404,
            statusMessage: "Asset not found or access denied",
        })
    }

    return {
        success: true,
        message: "Find asset successfully",
        data: asset
    }
})