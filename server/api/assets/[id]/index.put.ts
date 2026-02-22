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
            statusMessage: 'ไม่พบสินทรัพย์'
        })
    }

    const validated = await readValidatedBody(event, body => assetSchema.safeParse(body))

    if (!validated.success) {

        throw createError({
            status: 422,
            statusMessage: 'ข้อมูลไม่ถูกต้อง'
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
        message: 'อัปเดตสินทรัพย์สำเร็จ',
        data: assetUpdated,
    }
})