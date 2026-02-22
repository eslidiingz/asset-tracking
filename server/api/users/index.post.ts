import { usersTable } from "~~/server/database/schema";
import { User, userSchema } from "~~/server/models/user.model";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
    // Check if user is Admin
    const userRole = requireUserRole(event);
    if (userRole !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: "ไม่ได้รับอนุญาต",
        });
    }

    const validated = await readValidatedBody(event, body => userSchema.safeParse(body))
    if (!validated.success) {
        throw createError({
            status: 422,
            statusMessage: "ข้อมูลไม่ถูกต้อง",
        })
    }

    const userData: User = validated.data

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
        const userCreated = await useDrizzle().insert(usersTable).values({
            ...userData,
            password: hashedPassword
        }).returning().get()

        return {
            success: true,
            message: "เพิ่มผู้ใช้สำเร็จ",
            data: userCreated
        }
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed: users.username')) {
            throw createError({
                statusCode: 409,
                statusMessage: "ชื่อผู้ใช้ซ้ำ",
            })
        }
        throw error
    }
})