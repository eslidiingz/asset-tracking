import { z } from 'zod'
import { assetsTable, portsTable } from '~~/server/database/schema';
import { and, eq } from 'drizzle-orm';

const schema = z.object({
    asset_id: z.number(),
    name: z.string(),
    description: z.string().optional().nullable(),
    ratio: z.number().optional().nullable()
})

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => schema.safeParse(body))

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: `ข้อมูลไม่ถูกต้อง`,
        })

    const userId = requireUserId(event);

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
            statusMessage: 'ไม่ได้รับอนุญาต'
        })
    }

    const port: typeof portsTable.$inferInsert = validated.data
    const portCreated = await useDrizzle().insert(portsTable).values(port).returning().get()

    return {
        success: true,
        message: 'สร้างพอร์ตโฟลิโอสำเร็จ',
        data: portCreated,
    }
})