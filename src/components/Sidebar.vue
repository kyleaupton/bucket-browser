<template>
  <div class="h-full text-sm">
    <Menu class="h-full" :model="menuItems" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Menu from 'primevue/menu';
import { useConnectionsStore } from '@/stores/connections';

const connectionsStore = useConnectionsStore();

const menuItems = computed(() =>
  connectionsStore.connections.map((con) => ({
    label: con.nickname,
    icon: 'pi pi-cloud',
    command: () => connectionsStore.selectConnection(con.id),
  })),
);
</script>

<style scoped></style>
