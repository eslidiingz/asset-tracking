import { z } from 'zod'
import { assetsTable } from '../../database/schema';
import { assetSchema } from '../../models/asset.model';

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => assetSchema.safeParse(body))

    if (!result.success)
        throw createError({
            status: 422,
            statusMessage: `Asset name is required`,
        })

    const userId = requireUserId(event);

    const asset: typeof assetsTable.$inferInsert = {
        ...result.data,
        user_id: userId
    }

    const assetCreated = await useDrizzle().insert(assetsTable).values(asset).returning().get()

    return {
        success: true,
        message: 'Asset created successfully',
        data: assetCreated,
    }
});