import { eq } from "drizzle-orm";
import { usersTable } from "~~/server/database/schema";
import { userSchema } from "~~/server/models/user.model";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
    // Check if user is Admin
    requireUserRole(event);

    const userId = Number(getRouterParam(event, 'id'))
    if (isNaN(userId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid ID',
        })
    }

    const validated = await readValidatedBody(event, body => userSchema.partial().safeParse(body))
    if (!validated.success) {
        throw createError({
            status: 422,
            statusMessage: "Invalid body requested",
        })
    }

    const updateData: any = { ...validated.data }

    // Hash password if provided and not empty
    if (updateData.password && updateData.password.trim() !== '') {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
        delete updateData.password; // Don't update password if it's empty or blank
    }

    try {
        const userUpdated = useDrizzle().update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, userId))
            .returning()
            .get()

        if (!userUpdated) {
            throw createError({
                status: 404,
                statusMessage: 'User not found',
            })
        }

        return {
            success: true,
            message: "User updated successfully",
            data: userUpdated
        }
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed: users.username')) {
            throw createError({
                statusCode: 409,
                statusMessage: "Username already exists",
            })
        }
        throw error
    }
})
