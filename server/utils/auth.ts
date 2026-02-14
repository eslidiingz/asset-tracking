import jwt from 'jsonwebtoken'

export const getUserIdFromEvent = (event: any) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET
    if (!accessSecret) {
        console.error('JWT_ACCESS_SECRET is not defined in environment variables')
        return null
    }

    // 1. ดึงจาก Header (Access Token)
    const authHeader = getHeader(event, 'Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, accessSecret) as any
            return (decoded as { id: number }).id
        } catch (e) {
            // Token ผิดปกติ หรือหมดอายุ
        }
    }

    // 2. ดึงจาก Cookie
    const tokenCookie = getCookie(event, 'asset-tracking-access-token')
    if (tokenCookie) {
        try {
            const decoded = jwt.verify(tokenCookie, accessSecret) as any
            return (decoded as { id: number }).id
        } catch (e) {
            // Cookie ผิดปกติ หรือหมดอายุ
        }
    }

    return null
}

export const requireUserId = (event: any) => {
    const userId = getUserIdFromEvent(event)
    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Please login first'
        })
    }
    return userId
}
