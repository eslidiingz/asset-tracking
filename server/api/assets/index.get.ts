import { assetsTable } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);

    const assets = await useDrizzle().query.assetsTable.findMany({
        where: eq(assetsTable.user_id, userId),
        orderBy: (assetsTable, { desc }) => [desc(assetsTable.ratio)],
        with: {
            ports: {
                with: {
                    stocks: true
                }
            }
        }
    })

    return {
        success: true,
        message: "Get assets successfully",
        data: assets
    }
})