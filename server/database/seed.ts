import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import path from 'path';

const dbPath = path.resolve(process.cwd(), './server/database/db.sqlite');
const client = createClient({
    url: `file:${dbPath}`,
});
const db = drizzle(client, { schema });

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create default user
        const adminUsername = 'eslidiingz';
        const users = await db.select()
            .from(schema.usersTable)
            .where(eq(schema.usersTable.username, adminUsername))
            .all();

        const existingUser = users[0];

        if (!existingUser) {
            const salt = bcrypt.genSaltSync(10);

            await db.insert(schema.usersTable).values({
                username: adminUsername,
                password: "$2b$10$Xhicida0fJZwwc.yHOOAYOKECWd/IL4QEyzAcDBzIQMyuhjlNFprm",
                is_active: 1
            });

            console.log('✅ Default user created');
        } else {
            console.log('ℹ️ User admin already exists, skipping.');
        }

        console.log('🏁 Seed completed!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
