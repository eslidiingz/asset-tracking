export interface User {
    id: number;
    username: string;
    password: string;
    is_active: number;
    role: UserRole;
}

export type UserRole = 'ADMIN' | 'USER'