import { eq } from "drizzle-orm"
import { assetsTable } from "~~/server/database/schema"
import Asset, { assetSchema } from "~~/server/models/asset.model"

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const model = new Asset()
    const exist = await model.exist(id)

    if (!exist) {
        throw createError({
            status: 404,
            statusMessage: 'Asset not found'
        })
    }

    const validated = await readValidatedBody(event, body => assetSchema.safeParse(body))

    if (!validated.success) {

        throw createError({
            status: 422,
            statusMessage: 'Invalid request body'
        })
    }

    const asset: typeof assetsTable.$inferInsert = validated.data

    const assetUpdated = await useDrizzle().update(assetsTable)
        .set({
            ...asset,
            user_id: requireUserId(event)
        })
        .where(eq(assetsTable.id, id))
        .returning()
        .get()

    return {
        success: true,
        message: 'Asset updated successfully',
        data: assetUpdated,
    }
})