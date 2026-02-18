import { eq } from "drizzle-orm/sql";
import { usersTable } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    // Check if user is Admin
    const userRole = requireUserRole(event);
    if (userRole !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden: Admin access required",
        });
    }

    const userId = Number(getRouterParam(event, 'id'))
    const userDeleted = useDrizzle().delete(usersTable)
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