import { usersTable } from "../../database/schema";
import { asc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    // Check if user is Admin
    const userRole = requireUserRole(event);
    if (userRole !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden: Admin access required",
        });
    }

    const users = await useDrizzle().query.usersTable.findMany({
        columns: {
            password: false // Don't return passwords
        },
        orderBy: [asc(usersTable.username)]
    });

    return {
        success: true,
        message: "Users fetched successfully",
        data: users
    };
});
