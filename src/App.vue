<template>
  <div class="text-6xl">test</div>
</template>

<script setup lang="ts">
import { useConnectionsStore } from '@/stores/connections';

const connectionsStore = useConnectionsStore();
connectionsStore
  .getConnections()
  .then(() => console.log(connectionsStore.connections));
</script>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
