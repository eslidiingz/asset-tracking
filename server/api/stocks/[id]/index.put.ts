import StockModel, { stockSchema } from "~~/server/models/stock.model";

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => stockSchema.safeParse(body));

    if (!validated.success) {
        return {
            success: false,
            message: "Invalid body requested",
            data: null
        }
    }

    const model = new StockModel;
    const stockId = Number(getRouterParam(event, 'id'));
    const stockUpdated = model.update(stockId, validated.data)

    return {
        success: true,
        message: "Update stock successfully",
        data: stockUpdated
    };
})