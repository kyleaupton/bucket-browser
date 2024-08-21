<template>
  <div
    :key="connection.id"
    href="#"
    class="flex items-center rounded-md text-sm h-8 px-3 cursor-pointer select-none font-medium transition-colors dark:text-white dark:hover:bg-muted dark:hover:text-white"
    :class="{ 'dark:bg-muted': selected }"
    @click="selectConnection"
  >
    <Cloud class="mr-2 size-4 flex-shrink-0" />
    <div class="truncate">{{ connection.nickname }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Cloud } from 'lucide-vue-next';
import { ipcInvoke } from '@/ipc';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { SerializedConnection } from '@shared/types/connections';

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();

const props = defineProps<{
  connection: SerializedConnection;
}>();

const selected = computed(
  () => layoutStore.selectedConnection?.id === props.connection.id,
);

const selectConnection = () => {
  layoutStore.selectedConnection = props.connection;
  layoutStore.path = '';
};

const toggleMenu = (event: MouseEvent) => {
  layoutStore.contextMenuOptions = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        layoutStore.setDialog({
          name: 'connection',
          data: props.connection,
        });
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: async () => {
        const { response } = await ipcInvoke('/dialog/showMessageBox', {
          message: 'Are you sure you want do delete this connection?',
          type: 'question',
          buttons: ['Yes', 'Cancel'],
        });

        if (response === 0) {
          await connectionsStore.removeConnection(props.connection.id);
        }
      },
    },
  ];

  layoutStore.contextMenu.toggle(event);
};
</script>

<style scoped>
.sidebar-item-icon {
  display: none;
}

.sidebar-item:hover .sidebar-item-icon {
  display: flex;
}
</style>
