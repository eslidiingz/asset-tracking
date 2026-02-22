import StockModel, { stockSchema } from "~~/server/models/stock.model";

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => stockSchema.safeParse(body));

    if (!validated.success) {
        return {
            success: false,
            message: "ข้อมูลไม่ถูกต้อง",
            data: null
        }
    }

    const model = new StockModel;
    const stockId = Number(getRouterParam(event, 'id'));
    const stockUpdated = await model.update(stockId, validated.data)

    return {
        success: true,
        message: "อัปเดตหุ้นสำเร็จ",
        data: stockUpdated
    };
})