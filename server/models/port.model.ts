import { desc, eq } from "drizzle-orm"
import { assetsTable, portsTable } from "../database/schema"

export default class PortModel {
    get = async (userId: number) => {
        return await useDrizzle().query.portsTable.findMany({
            orderBy: (portsTable, { desc }) => [desc(portsTable.ratio)],
            with: {
                asset: {
                    where: eq(assetsTable.user_id, userId),
                },
                stocks: true
            }
        })
    }
}