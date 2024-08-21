<template>
  <div class="relative flex flex-col h-full p-2">
    <div class="flex-grow">
      <div
        v-if="connectionsStore.connections.length"
        class="flex flex-col gap-1"
      >
        <SidebarItem
          v-for="con of connectionsStore.connections"
          :key="con.id"
          :connection="con"
        />
      </div>

      <div
        v-else
        class="absolute select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground"
      >
        No Connections
      </div>
    </div>

    <Button variant="secondary" size="xs" @click="showNewConnection"
      >New Connection</Button
    >
  </div>
</template>

<script setup lang="ts">
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { Button } from '@/components/ui/button';
import SidebarItem from './SidebarItem.vue';

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();

const showNewConnection = () => layoutStore.setDialog({ name: 'connection' });
</script>

<style scoped></style>
