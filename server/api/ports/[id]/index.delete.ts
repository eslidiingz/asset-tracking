import { portsTable } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const portId = Number(getRouterParam(event, 'id'))

    const portDeleted = useDrizzle().delete(portsTable)
        .where(eq(portsTable.id, portId))
        .returning()
        .get()
    
    if (!portDeleted) {
        throw createError({
            status: 404,
            statusMessage: 'Portfolio not found',
        })
    }

    return {
        success: true,
        message: 'Port deleted successfully',
        data: portDeleted,
    }
})
