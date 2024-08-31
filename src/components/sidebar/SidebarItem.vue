<template>
  <div
    ref="item"
    :key="connection.id"
    class="flex items-center rounded-md text-sm h-8 px-3 cursor-pointer select-none font-medium transition-colors overflow-hidden hover:bg-muted/60"
    :class="[{ '!bg-muted/60': selected }, { '!bg-muted': showContextMenu }]"
    @click.self="selectConnection"
    @contextmenu="toggleRightClick"
  >
    <!-- Right side -->
    <Cloud
      class="mr-2 size-4 flex-shrink-0 text-muted-foreground"
      @click="selectConnection"
    />

    <!-- Rest of item container-->
    <div
      class="w-full flex items-center justify-between overflow-hidden"
      @click.self="selectConnection"
    >
      <div class="truncate" @click="selectConnection">
        {{ connection.name }}
      </div>
      <div ref="button" class="flex">
        <Button
          class="w-6 h-6 select-none"
          size="icon"
          variant="ghost"
          @click="toggleThreeDots"
        >
          <Ellipsis class="size-5 flex-shrink-0 text-muted-foreground" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, VNode } from 'vue';
import { Cloud, Ellipsis, Pencil, Trash } from 'lucide-vue-next';
import { ipcInvoke } from '@/ipc';
import { createContextMenu } from '@/contextMenu';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { SerializedConnection } from '@shared/types/connections';
import { Button } from '@/components/ui/button';

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();

const props = defineProps<{
  connection: SerializedConnection;
}>();

const item = ref<HTMLElement>();
const button = ref<HTMLElement>();
const showContextMenu = ref(false);

const selected = computed(
  () => layoutStore.selectedConnectionId === props.connection.id,
);

const selectConnection = (): void => {
  layoutStore.selectedConnectionId = props.connection.id;
  layoutStore.path = '';
};

const contextItems = [
  {
    render: (): VNode =>
      h('div', { class: 'w-44' }, [
        h(Pencil, { class: 'mr-2 h-4 w-4' }),
        h('div', 'Edit'),
      ]),
    command: (): void => {
      layoutStore.setDialog({
        name: 'connection',
        edit: props.connection.id,
      });
    },
  },
  {
    render: (): VNode =>
      h('div', { class: 'w-44' }, [
        h(Trash, { class: 'mr-2 h-4 w-4' }),
        h('div', 'Delete'),
      ]),
    command: async (): Promise<void> => {
      const { response } = await ipcInvoke('/dialog/showMessageBox', {
        message: 'Are you sure you want do delete this connection?',
        type: 'question',
        buttons: ['Yes', 'Cancel'],
      });

      if (response === 0) {
        await connectionsStore.removeConnection(props.connection);
      }
    },
  },
];

const toggleThreeDots = (event: MouseEvent): void => {
  createContextMenu(event, contextItems, {
    anchor: 'bottom',
    target: button.value,
    onOpen: () => {
      showContextMenu.value = true;
    },
    onClose: () => {
      showContextMenu.value = false;
    },
  });
};

const toggleRightClick = (event: MouseEvent): void => {
  createContextMenu(event, contextItems, {
    anchor: 'bottom',
    target: item.value,
    onOpen: () => {
      showContextMenu.value = true;
    },
    onClose: () => {
      showContextMenu.value = false;
    },
  });
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
