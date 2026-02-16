<script setup lang="ts">
const emit = defineEmits(['edit', 'delete'])

const menu = ref();
const items = ref([
    {
        id: 'edit_item',
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => emit('edit')
    },
    {
        separator: true
    },
    {
        id: 'delete_item',
        label: 'Delete',
        icon: 'pi pi-trash',
        class: 'text-red-500',
        command: () => emit('delete')
    }
]);

const toggle = (event: Event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <div class="asset-actions">
        <Button type="button" icon="pi pi-ellipsis-v" @click.stop="toggle" aria-haspopup="true" severity="secondary"
            text rounded class="w-8 h-8 flex items-center justify-end" />
        <Menu ref="menu" :model="items" :popup="true" class="!min-w-0" />
    </div>
</template>

<style scoped>
:deep(.p-menu) {
    padding: 0.25rem;
}

:deep(.p-menu-list) {
    padding: 0;
}

:deep(.p-menuitem-link) {
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

:deep(.p-menuitem-icon) {
    margin-right: 0 !important;
    font-size: 0.875rem;
}

:deep(.p-menuitem-text) {
    font-size: 0.875rem;
    white-space: nowrap;
}

/* Make red text for delete item specifically for PrimeVue Menu */
:deep(.text-red-500 .p-menuitem-text),
:deep(.text-red-500 .p-menuitem-icon) {
    color: #ef4444 !important;
}
</style>
