import { z } from "zod";

export const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(['ADMIN', 'USER']),
    is_active: z.number()
})

export type User = z.infer<typeof userSchema>