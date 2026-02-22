import { assetsTable } from "~~/server/database/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);

    const assetId = Number(getRouterParam(event, 'id'));
    const asset = await useDrizzle().query.assetsTable.findFirst({
        where: and(
            eq(assetsTable.id, assetId),
            eq(assetsTable.user_id, userId)
        ),
        with: {
            ports: {
                with: {
                    stocks: true
                }
            }
        }
    })

    if (!asset) {
        throw createError({
            statusCode: 404,
            statusMessage: "ไม่พบสินทรัพย์หรือไม่ได้รับอนุญาต",
        })
    }

    return {
        success: true,
        message: "ค้นหาสินทรัพย์สำเร็จ",
        data: asset
    }
})