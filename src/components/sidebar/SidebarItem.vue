<template>
  <div
    class="sidebar-item flex items-center h-[38px] justify-between gap-2 p-2 rounded-lg cursor-pointer select-none text-sm dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    :class="{
      'sidebar-item-selected bg-neutral-200 dark:bg-neutral-800': selected,
    }"
    @click.self="connectionsStore.selectConnection(props.connection.id)"
  >
    <p
      class="truncate"
      @click="connectionsStore.selectConnection(props.connection.id)"
    >
      {{ props.connection.nickname }}
    </p>

    <div
      class="sidebar-item-icon justify-center items-center p-[3px] rounded-lg"
      @click="toggle"
    >
      <i class="pi pi-ellipsis-h"></i>
    </div>
  </div>

  <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import Menu from 'primevue/menu';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { showMessageChannel } from '@shared/ipc/dialog';
import { SerializedConnection } from '@shared/types/connections';
import { computed } from 'vue';

const connectionsStore = useConnectionsStore();
const { setDialog } = useLayoutStore();

const { selectedConnection } = storeToRefs(connectionsStore);

const props = defineProps<{
  connection: SerializedConnection;
}>();

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          setDialog({ name: 'connection', data: props.connection });
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
            await connectionsStore.removeConnection(props.connection);
          }
        },
      },
    ],
  },
]);

const selected = computed(
  () => selectedConnection.value === props.connection.id,
);

const toggle = (event: MouseEvent) => {
  menu.value.toggle(event);
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
