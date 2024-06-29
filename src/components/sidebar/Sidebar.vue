<template>
  <div class="flex flex-col h-full p-2">
    <div class="grow">
      <div class="m-2 text-xs dark:text-neutral-400">Connections</div>
      <SidebarItem
        v-for="con of connectionsStore.connections"
        :key="con.id"
        :connection="con"
      />
    </div>

    <Button
      severity="secondary"
      size="small"
      @click="layoutStore.setDialog({ name: 'connection' })"
      >Add Connection</Button
    >
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SidebarItem from '@/components/sidebar/SidebarItem.vue';
import { useConnectionsStore, useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();
const connectionsStore = useConnectionsStore();
</script>

<style scoped></style>
