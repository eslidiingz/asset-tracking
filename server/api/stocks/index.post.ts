import StockModel, { Stock, stockSchema } from "~~/server/models/stock.model";

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => stockSchema.safeParse(body));

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: "Invalid body requested",
        })

    const model = new StockModel;

    // เช็คว่าหุ้นตัวนี้มีอยู่ในพอร์ตนี้แล้วหรือยัง (เช็คคู่ port_id และ symbol)
    const symbolExists = model.symbolExist(validated.data.port_id, validated.data.symbol)

    if (symbolExists)
        throw createError({
            status: 422,
            statusMessage: "Symbol already exists.",
        })

    const stock: Stock = validated.data;

    // ส่งไป Google Script (ถ้ายังจำเป็นต้องใช้)
    try {
        await $fetch(`https://script.google.com/macros/s/AKfycbzuqFKPuH_g9ySbQGii4gu_YdQG0mh9n5sVfSKENfzb3sg0uWlsqSYJ8azb_Pf2kgezsw/exec`, {
            method: 'POST',
            body: stock
        })

        // บันทึกข้อมูลลง Database
        const stockCreated = model.create(stock);

        return {
            success: true,
            message: "Stock created successfully",
            data: stockCreated
        }
    } catch (e) {
        console.error('External API failed, but continuing to local DB', e)
    }

})
