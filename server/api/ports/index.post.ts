import { z } from 'zod'
import { portsTable } from '~~/server/database/schema';
import { useDrizzle } from '~~/server/utils/drizzle';

const schema = z.object({
    asset_id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    ratio: z.number().optional()
})

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => schema.safeParse(body))

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: `Portfolio name is required`,
        })

    const port: typeof portsTable.$inferInsert = validated.data

    const portCreated = useDrizzle().insert(portsTable).values(port).returning().get()
    
    return {
        success: true,
        message: 'Port created successfully',
        data: portCreated,
    }
})