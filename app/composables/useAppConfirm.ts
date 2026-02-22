export const useAppConfirm = () => {
    const confirm = useConfirm()
    const toast = useToast()

    const requireConfirm = (options: {
        message?: string;
        header?: string;
        icon?: string;
        acceptLabel?: string;
        rejectLabel?: string;
        acceptSeverity?: string;
        onAccept: () => Promise<any>;
        successSummary?: string;
        successDetail?: string;
    }) => {
        confirm.require({
            message: options.message || 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ',
            header: options.header || 'ยืนยัน',
            icon: options.icon || 'pi pi-exclamation-triangle',
            rejectProps: {
                label: options.rejectLabel || 'ยกเลิก',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: options.acceptLabel || 'ยืนยัน',
                severity: (options.acceptSeverity as any) || 'primary'
            },
            accept: async () => {
                try {
                    const result = await options.onAccept()

                    // Logic: Success if result is true, undefined, or has success: true
                    // Failure if result is false or has success: false
                    const isSuccess = result === undefined || result === true || (result && result.success !== false);

                    if (isSuccess) {
                        if (options.successDetail) {
                            toast.add({
                                severity: 'success',
                                summary: options.successSummary || 'สำเร็จ',
                                detail: options.successDetail,
                                life: 3000
                            });
                        }
                    } else {
                        toast.add({
                            severity: 'error',
                            summary: 'เกิดข้อผิดพลาด',
                            detail: result?.message || result?.statusMessage || 'เกิดข้อผิดพลาด',
                            life: 4000
                        });
                    }
                } catch (error: any) {
                    toast.add({
                        severity: 'error',
                        summary: 'เกิดข้อผิดพลาด',
                        detail: error.statusMessage || error.message || 'เกิดข้อผิดพลาด',
                        life: 4000
                    });
                }
            },
        });
    }

    // Specialized function for Delete
    const requireDelete = (onAccept: () => Promise<any>, detail = 'Record deleted') => {
        requireConfirm({
            message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้',
            header: 'ยืนยันการลบ',
            acceptLabel: 'ลบ',
            acceptSeverity: 'danger',
            onAccept,
            successSummary: 'ลบแล้ว',
            successDetail: detail
        })
    }

    // Specialized function for Saving/Updating
    const requireSave = (onAccept: () => Promise<any>, detail = 'Changes saved successfully') => {
        requireConfirm({
            message: 'คุณแน่ใจหรือไม่ว่าต้องการบันทึกการเปลี่ยนแปลงนี้',
            header: 'ยืนยันการบันทึก',
            icon: 'pi pi-check-circle',
            acceptLabel: 'บันทึก',
            acceptSeverity: 'primary',
            onAccept,
            successSummary: 'บันทึกแล้ว',
            successDetail: detail
        })
    }

    return {
        requireConfirm,
        requireDelete,
        requireSave
    }
}
