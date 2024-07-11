<template>
  <div class="relative flex flex-col h-full p-2 rounded-lg dark:bg-neutral-900">
    <div class="flex items-center justify-between gap-2 mx-2">
      <div class="dark:text-neutral-300">Connections</div>
      <Button
        icon="pi pi-plus"
        severity="secondary"
        text
        rounded
        @click="showNewConnection"
      />
    </div>

    <div v-if="connectionsStore.connections.length > 0" class="grow">
      <SidebarItem
        v-for="con of connectionsStore.connections"
        :key="con.id"
        :connection="con"
      />
    </div>

    <div
      v-else
      class="absolute select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-300"
    >
      No Connections
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SidebarItem from '@/components/sidebar/SidebarItem.vue';
import { useConnectionsStore, useLayoutStore } from '@/stores';

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();

const showNewConnection = () => layoutStore.setDialog({ name: 'connection' });
</script>

<style scoped></style>
