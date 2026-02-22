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
            statusMessage: 'ไม่พบสินทรัพย์'
        })
    }

    const assetDeleted = await useDrizzle().delete(assetsTable).where(eq(assetsTable.id, assetId)).returning().get();

    if (!assetDeleted) {
        throw createError({
            status: 500,
            statusMessage: 'ไม่สามารถลบสินทรัพย์ได้'
        })
    }

    setResponseStatus(event, 204);
})