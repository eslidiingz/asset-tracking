export default defineEventHandler(async (event) => {
    const assets = await useDrizzle().query.assetsTable.findMany({
        orderBy: (assetsTable, { desc }) => [desc(assetsTable.ratio)],
        with: {
            ports: {
                with: {
                    stocks: true
                }
            }
        }
    })

    return {
        success: true,
        message: "Get assets successfully",
        data: assets
    }
})