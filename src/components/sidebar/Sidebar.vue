<template>
  <div class="flex flex-col h-full p-2">
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
