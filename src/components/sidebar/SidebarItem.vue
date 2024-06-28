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
      class="sidebar-item-icon justify-center items-center p-[3px] rounded-lg dark:hover:bg-neutral-700"
      @click="
        setDialog({
          name: 'connection',
          data: props.connection,
        })
      "
    >
      <i class="pi pi-ellipsis-h"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { SerializedConnection } from '@shared/types/connections';
import { computed } from 'vue';

const connectionsStore = useConnectionsStore();
const { setDialog } = useLayoutStore();

const { selectedConnection } = storeToRefs(connectionsStore);

const props = defineProps<{
  connection: SerializedConnection;
}>();

const selected = computed(
  () => selectedConnection.value === props.connection.id,
);
</script>

<style scoped>
.sidebar-item-icon {
  display: none;
}

.sidebar-item:hover .sidebar-item-icon {
  display: flex;
}
</style>
