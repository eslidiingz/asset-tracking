import { z } from 'zod'
import { assetsTable } from '../../database/schema';
import { assetSchema } from '../../models/asset.model';

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => assetSchema.safeParse(body))

    if (!result.success)
        throw createError({
            status: 422,
            statusMessage: `ข้อมูลไม่ถูกต้อง`,
        })

    const userId = requireUserId(event);

    const asset: typeof assetsTable.$inferInsert = {
        ...result.data,
        user_id: userId
    }

    const assetCreated = await useDrizzle().insert(assetsTable).values(asset).returning().get()

    return {
        success: true,
        message: 'เพิ่มสินทรัพย์สำเร็จ',
        data: assetCreated,
    }
});