<template>
  <div class="flex flex-col h-full p-2">
    <div class="grow">
      <div class="flex mb-2 justify-end items-center">
        <!-- <div class="ml-2 mt-2 text-xs dark:text-neutral-400">Connections</div> -->
        <div class="flex gap-2">
          <Button
            icon="pi pi-sync"
            severity="secondary"
            size="small"
            @click="showTransfers"
          />
          <Button
            icon="pi pi-plus"
            severity="secondary"
            size="small"
            @click="showNewConnection"
          />
        </div>
      </div>

      <SidebarItem
        v-for="con of connectionsStore.connections"
        :key="con.id"
        :connection="con"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SidebarItem from '@/components/sidebar/SidebarItem.vue';
import { useConnectionsStore, useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();
const connectionsStore = useConnectionsStore();

const showTransfers = () => layoutStore.setDialog({ name: 'transfers' });
const showNewConnection = () => layoutStore.setDialog({ name: 'connection' });
</script>

<style scoped></style>
