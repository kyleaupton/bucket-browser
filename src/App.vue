<template>
  <Splitter class="h-full">
    <SplitterPanel :size="35" :min-size="20">
      <Sidebar />
    </SplitterPanel>
    <SplitterPanel :size="65" :min-size="65">
      <Browser />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import { useConnectionsStore } from '@/stores/connections';
import Sidebar from '@/components/Sidebar.vue';
import Browser from '@/components/Browser.vue';

const connectionsStore = useConnectionsStore();
connectionsStore
  .getConnections()
  .then(() => console.log(connectionsStore.connections));
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  padding: 12px;
}
</style>
