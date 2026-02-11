import { portsTable } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const portId = Number(getRouterParam(event, 'id'))
    const port = useDrizzle().select().from(portsTable).where(eq(portsTable.id, portId)).get();

    return {
        success: true,
        message: "Find port successfully",
        data: port
    }
})