import { eq } from "drizzle-orm";
import { stocksTable } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const stockId = Number(getRouterParam(event, "id"));
  const stock = await useDrizzle().select().from(stocksTable).where(eq(stocksTable.id, stockId)).get();

  if (!stock) {
    throw createError({
      statusCode: 404,
      statusMessage: "ไม่พบหุ้น",
    });
  }

  const result = await useDrizzle()
    .delete(stocksTable)
    .where(eq(stocksTable.id, stockId))
    .run();

  return {
    success: true,
    message: "ลบหุ้นสำเร็จ",
    data: result,
  };
});
