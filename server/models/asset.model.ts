import { eq } from "drizzle-orm";
import { assetsTable } from "../database/schema";
import z from "zod";

export const assetSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    ratio: z.number().nullable().optional(),
})


export default class Asset {
    find(id: number) {
        return useDrizzle().query.assetsTable.findFirst({
            where: eq(assetsTable.id, id)
        })
    }

    exist(id: number) {
        return useDrizzle().select().from(assetsTable).where(eq(assetsTable.id, id)).limit(1).get()
    }
}