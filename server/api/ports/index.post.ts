import { z } from 'zod'
import { assetsTable, portsTable } from '~~/server/database/schema';
import { and, eq } from 'drizzle-orm';

const schema = z.object({
    asset_id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    ratio: z.number().optional()
})

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);
    const validated = await readValidatedBody(event, body => schema.safeParse(body))

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: `Portfolio name is required`,
        })

    // ตรวจสอบว่า Asset ที่อ้างถึงเป็นของผู้ใช้นี้จริงหรือไม่
    const asset = await useDrizzle().select()
        .from(assetsTable)
        .where(and(
            eq(assetsTable.id, validated.data.asset_id),
            eq(assetsTable.user_id, userId)
        ))
        .get();

    if (!asset) {
        throw createError({
            status: 403,
            statusMessage: 'Unauthorized: Direct access to this asset is not allowed'
        })
    }

    const port: typeof portsTable.$inferInsert = validated.data
    const portCreated = await useDrizzle().insert(portsTable).values(port).returning().get()

    return {
        success: true,
        message: 'Port created successfully',
        data: portCreated,
    }
})