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
            message: options.message || 'Are you sure you want to proceed?',
            header: options.header || 'Confirmation',
            icon: options.icon || 'pi pi-exclamation-triangle',
            rejectProps: {
                label: options.rejectLabel || 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: options.acceptLabel || 'Confirm',
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
                                summary: options.successSummary || 'Success',
                                detail: options.successDetail,
                                life: 3000
                            });
                        }
                    } else {
                        toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: result?.message || result?.statusMessage || 'Action failed',
                            life: 4000
                        });
                    }
                } catch (error: any) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.statusMessage || error.message || 'An unexpected error occurred',
                        life: 4000
                    });
                }
            },
        });
    }

    // Specialized function for Delete
    const requireDelete = (onAccept: () => Promise<any>, detail = 'Record deleted') => {
        requireConfirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            acceptLabel: 'Delete',
            acceptSeverity: 'danger',
            onAccept,
            successSummary: 'Deleted',
            successDetail: detail
        })
    }

    // Specialized function for Saving/Updating
    const requireSave = (onAccept: () => Promise<any>, detail = 'Changes saved successfully') => {
        requireConfirm({
            message: 'Are you sure you want to save these changes?',
            header: 'Save Confirmation',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Save',
            acceptSeverity: 'primary',
            onAccept,
            successSummary: 'Saved',
            successDetail: detail
        })
    }

    return {
        requireConfirm,
        requireDelete,
        requireSave
    }
}
