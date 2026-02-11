import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { stocksTable } from "~~/server/database/schema";

const schema = z.object({
    port_id: z.number(),
    symbol: z.string(),
    amount: z.number(),
    cost: z.number(),
    ratio: z.number().optional(),
})


export default defineEventHandler(async (event) => {
    const validated = await readValidatedBody(event, body => schema.safeParse(body));

    if (!validated.success)
        throw createError({
            status: 422,
            statusMessage: "Some fields are missing",
        })

    // เช็คว่าหุ้นตัวนี้มีอยู่ในพอร์ตนี้แล้วหรือยัง (เช็คคู่ port_id และ symbol)
    const symbolExists = useDrizzle().select()
        .from(stocksTable)
        .where(
            and(
                eq(stocksTable.port_id, validated.data.port_id),
                eq(stocksTable.symbol, validated.data.symbol)
            )
        ).get();

    if (symbolExists)
        throw createError({
            status: 422,
            statusMessage: "Symbol already exists in this portfolio",
        })

    const stock: typeof stocksTable.$inferInsert = validated.data;

    // ส่งไป Google Script (ถ้ายังจำเป็นต้องใช้)
    // try {
    //     const result = await $fetch(`https://script.google.com/macros/s/AKfycbzuqFKPuH_g9ySbQGii4gu_YdQG0mh9n5sVfSKENfzb3sg0uWlsqSYJ8azb_Pf2kgezsw/exec`, {
    //         method: 'POST',
    //         body: stock
    //     })
    //     console.log(result)
    // } catch (e) {
    //     console.error('External API failed, but continuing to local DB', e)
    // }

    // บันทึกข้อมูลลง Database
    // const stockCreated = useDrizzle().insert(stocksTable).values(stock).returning().get();

    // return {
    //     success: true,
    //     message: "Stock created successfully",
    //     data: stockCreated
    // }
})
