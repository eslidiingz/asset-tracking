import { usersTable } from "../database/schema";
import { eq } from "drizzle-orm";
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
    const user = db.select().from(usersTable).where(eq(usersTable.username, username)).get();

    if (!user) {
        return {
            success: false,
            message: "User not found"
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
    }

    // 1. สร้าง Access Token (อายุสั้น เช่น 15 นาที)
    const accessToken = jwt.sign(
        userCredential,
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '15m' }
    );

    // 2. สร้าง Refresh Token (อายุยาว เช่น 7 วัน)
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    // 3. เก็บ Refresh Token ใน HttpOnly Cookie
    setCookie(event, 'asset-tracking-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 วัน
    });

    return {
        success: true,
        message: "Login successful",
        user: userCredential,
        access_token: accessToken
    }
})