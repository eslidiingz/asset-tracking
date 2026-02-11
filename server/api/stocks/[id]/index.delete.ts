import { eq } from "drizzle-orm";
import { stocksTable } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const stockId = Number(getRouterParam(event, "id"));
  const stock = useDrizzle().select().from(stocksTable).where(eq(stocksTable.id, stockId)).get();

  if (!stock) {
    throw createError({
      statusCode: 404,
      statusMessage: "Stock not found",
    });
  }

  const result = useDrizzle()
    .delete(stocksTable)
    .where(eq(stocksTable.id, stockId))
    .run();

  return {
    success: true,
    message: "Stock deleted successfully",
    data: result,
  };
});
