import { eq } from "drizzle-orm/sql";
import { usersTable } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    // Check if user is Admin
    requireUserRole(event);

    const userId = Number(getRouterParam(event, 'id'))
    const userDeleted = await useDrizzle().delete(usersTable)
        .where(eq(usersTable.id, userId))
        .returning()
        .get()

    if (!userDeleted) {
        throw createError({
            status: 404,
            statusMessage: 'User not found',
        })
    }

    return {
        success: true,
        message: 'User deleted successfully',
        data: userDeleted,
    }
})