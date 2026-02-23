import { eq } from "drizzle-orm";
import { assetsTable } from "../database/schema";
import z from "zod";

export const assetSchema = z.object({
    name: z.string(),
    currency: z.enum(['usd', 'thb']),
    description: z.string().nullable().optional(),
    ratio: z.number().nullable().optional(),
})

export default class Asset {
    async find(id: number) {
        return await useDrizzle().query.assetsTable.findFirst({
            where: eq(assetsTable.id, id)
        })
    }

    async exist(id: number) {
        const result = await useDrizzle().select().from(assetsTable).where(eq(assetsTable.id, id)).limit(1).get()
        return !!result
    }
}
