<template>
  <div class="flex flex-col h-full p-2 rounded-lg dark:bg-neutral-900">
    <div class="flex items-center gap-2 mx-2 mb-2">
      <i class="pi pi-cloud" style="font-size: 1.2rem"></i>
      <div class="dark:text-neutral-300">Connections</div>
    </div>
    <div class="grow">
      <SidebarItem
        v-for="con of connectionsStore.connections"
        :key="con.id"
        :connection="con"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarItem from '@/components/sidebar/SidebarItem.vue';
import { useConnectionsStore } from '@/stores';

const connectionsStore = useConnectionsStore();
</script>

<style scoped></style>
