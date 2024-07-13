<template>
  <div
    class="sidebar-item flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer select-none dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    :class="{
      'sidebar-item-selected bg-neutral-200 dark:bg-neutral-800': selected,
    }"
    @click.self="selectConnection"
  >
    <div class="flex gap-2 items-center overflow-hidden">
      <i class="pi pi-cloud" style="font-size: 1.2rem"></i>
      <p class="truncate" @click="selectConnection">
        {{ props.connection.nickname }}
      </p>
    </div>

    <div
      class="sidebar-item-icon justify-center items-center p-[3px] rounded-lg"
      @click="toggleMenu"
    >
      <i class="pi pi-ellipsis-h"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { showMessageChannel } from '@shared/ipc/dialog';
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
        const { response } = await window.ipcInvoke(showMessageChannel, {
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
