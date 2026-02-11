import { z } from 'zod'
import { assetsTable } from '~~/server/database/schema';
import { useDrizzle } from '~~/server/utils/drizzle';

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    ratio: z.number().optional()
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => schema.safeParse(body))

    if (!result.success)
        throw createError({
            status: 422,
            statusMessage: `Asset name is required`,
        })

    const asset: typeof assetsTable.$inferInsert = result.data

    const assetCreated = useDrizzle().insert(assetsTable).values(asset).returning().get()

    return {
        success: true,
        message: 'Asset created successfully',
        data: assetCreated,
    }
});