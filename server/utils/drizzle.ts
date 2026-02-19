import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "../database/schema";
import path from "node:path";

const dbUrl = process.env.TURSO_DATABASE_URL || 'file:server/database/db.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

// ตรวจสอบว่าเป็นไฟล์โลคอลหรือไม่ (ถ้าขึ้นต้นด้วย file: และเป็น relative path)
let finalUrl = dbUrl;
if (dbUrl.startsWith('file:') && !path.isAbsolute(dbUrl.replace('file:', ''))) {
    const relativePath = dbUrl.replace('file:', '');
    const baseDir = process.cwd().endsWith('.output')
        ? path.resolve(process.cwd(), '..')
        : process.cwd();
    finalUrl = `file:${path.resolve(baseDir, relativePath)}`;
}

const client = createClient({
    url: finalUrl,
    authToken: authToken,
});

const db = drizzle(client, { schema });

export const useDrizzle = () => db
