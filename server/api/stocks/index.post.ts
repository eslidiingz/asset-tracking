import StockModel, { Stock, stockSchema } from "~~/server/models/stock.model";

export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => stockSchema.safeParse(body));

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: "ข้อมูลไม่ถูกต้อง",
        })

    const model = new StockModel;

    // เช็คว่าหุ้นตัวนี้มีอยู่ในพอร์ตนี้แล้วหรือยัง (เช็คคู่ port_id และ symbol)
    const symbolExists = await model.symbolExist(validated.data.port_id, validated.data.symbol)

    if (symbolExists)
        throw createError({
            status: 422,
            statusMessage: "หุ้นนี้มีอยู่ในพอร์ตแล้ว",
        })

    const stock: Stock = validated.data;

    if (stock.type === 'stock') {
        // ส่งไป Google Script (ถ้ายังจำเป็นต้องใช้)
        try {
            const config = useRuntimeConfig()
            await $fetch(config.public.priceListApi as string, {
                method: 'POST',
                body: stock
            })
        } catch (e) {
            console.error('External API failed, but continuing to local DB', e)
            return
        }
    } else if (stock.type === 'crypto') {

    } else if (stock.type === 'fund') {

    }

    // บันทึกข้อมูลลง Database
    const stockCreated = await model.create(stock);

    return {
        success: true,
        message: "เพิ่มหุ้นสำเร็จ",
        data: stockCreated
    }

})
