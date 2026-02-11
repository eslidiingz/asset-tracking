import { z } from 'zod'
import { portsTable } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

const schema = z.object({
    asset_id: z.coerce.number(),
    name: z.string(),
    description: z.string().optional().nullable(),
    ratio: z.coerce.number().optional().nullable(),
    sequence: z.coerce.number().optional().nullable()
}).passthrough()

export default defineEventHandler(async (event) => {
    const portId = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const validated = schema.safeParse(body)

    if (!validated.success) {
        console.error('Validation error:', validated.error)
        throw createError({
            status: 422,
            statusMessage: `Invalid data for portfolio update: ${validated.error.message}`,
        })
    }

    // Filter out fields that shouldn't be updated or are derived
    const { id, stocks, cost, profitAmount, profitPercentage, value, ...portUpdate } = validated.data

    const portUpdated = useDrizzle().update(portsTable)
        .set(portUpdate)
        .where(eq(portsTable.id, portId))
        .returning()
        .get()
    
    return {
        success: true,
        message: 'Port updated successfully',
        data: portUpdated,
    }
})
