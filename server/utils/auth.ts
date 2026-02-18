import jwt from 'jsonwebtoken'

export const getUserIdFromEvent = (event: any) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET
    if (!accessSecret) {
        console.error('JWT_ACCESS_SECRET is not defined in environment variables')
        return null
    }

    const authHeader = getHeader(event, 'Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : getCookie(event, 'asset-tracking-access-token')

    if (token) {
        try {
            const decoded = jwt.verify(token, accessSecret) as any
            return (decoded as { id: number }).id
        } catch (e) { }
    }

    return null
}

export const getUserRoleFromEvent = (event: any) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET
    if (!accessSecret) return null

    const authHeader = getHeader(event, 'Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : getCookie(event, 'asset-tracking-access-token')

    if (token) {
        try {
            const decoded = jwt.verify(token, accessSecret) as any
            return (decoded as { role: string }).role
        } catch (e) { }
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

export const requireUserRole = (event: any) => {
    const role = getUserRoleFromEvent(event)
    if (role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Admin access required'
        })
    }
    return role
}
