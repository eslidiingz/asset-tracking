import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "../database/schema"

const db = drizzle(process.env.DATABASE_URL!, { schema })

export const useDrizzle = () => db