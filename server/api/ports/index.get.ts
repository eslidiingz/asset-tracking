import PortModel from "~~/server/models/port.model";

export default defineEventHandler(async (event) => {
    const userId = requireUserId(event);
    const model = new PortModel;
    const ports = await model.get(userId);

    return {
        success: true,
        message: 'Get ports successfully',
        data: ports
    }
})