import { assetsTable } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const assetId = Number(getRouterParam(event, 'id'));

    const asset = await useDrizzle().query.assetsTable.findFirst({
        where: eq(assetsTable.id, assetId)
    })

    if (!asset) {
        throw createError({
            status: 404,
            statusMessage: 'Asset not found'
        })
    }

    const assetDeleted = useDrizzle().delete(assetsTable).where(eq(assetsTable.id, assetId)).returning().get();

    if (!assetDeleted) {
        throw createError({
            status: 500,
            statusMessage: 'Failed to delete asset'
        })
    }

    setResponseStatus(event, 204);
})