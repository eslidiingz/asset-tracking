import { assetsTable } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);

    const assets = await useDrizzle().query.assetsTable.findMany({
        where: eq(assetsTable.user_id, userId),
        orderBy: (assetsTable, { desc }) => [desc(assetsTable.ratio)],
        with: {
            ports: {
                orderBy: (portsTable, { desc }) => [desc(portsTable.ratio)],
                with: {
                    stocks: {
                        orderBy: (stocksTable, { desc }) => [desc(stocksTable.ratio)]
                    }
                }
            }
        }
    })

    return {
        success: true,
        message: "ค้นหาสินทรัพย์สำเร็จ",
        data: assets
    }
})