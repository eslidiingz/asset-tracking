import { usersTable } from "../database/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Username and password are required",
        });
    }

    const db = useDrizzle();
    const user = db.select().from(usersTable)
        .where(
            and(
                eq(usersTable.username, username),
                eq(usersTable.is_active, 1)
            )
        )
        .get();

    if (!user) {
        return {
            success: false,
            message: "Invalid username or password"
        }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return {
            success: false,
            message: "Invalid password"
        }
    }

    const userCredential = {
        id: user.id,
        username: user.username,
        role: user.role
    }

    const accessToken = jwt.sign(
        userCredential,
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '24h' }
    );

    setCookie(event, 'asset-tracking-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 ชั่วโมง
    });

    return {
        success: true,
        message: "Login successful",
        user: userCredential,
        access_token: accessToken
    }
})