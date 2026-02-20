import { assetsTable, portsTable } from "~~/server/database/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);
    const portId = Number(getRouterParam(event, 'id'))

    // Join with assets to verify ownership
    const data = await useDrizzle().select({
        port: portsTable
    })
        .from(portsTable)
        .innerJoin(assetsTable, eq(portsTable.asset_id, assetsTable.id))
        .where(
            and(
                eq(portsTable.id, portId),
                eq(assetsTable.user_id, userId)
            )
        )
        .get();

    if (!data) {
        throw createError({
            statusCode: 404,
            statusMessage: "Port not found or access denied",
        })
    }

    return {
        success: true,
        message: "Find port successfully",
        data: data.port
    }
})