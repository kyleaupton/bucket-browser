<template>
  <Splitter class="main mx-2 mb-2">
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

import Sidebar from '@/components/sidebar/Sidebar.vue';
import Browser from '@/components/browser/Browser.vue';
</script>

<style scoped>
.main {
  height: 100%;
  max-height: calc(100vh - 3rem - 0.5rem);
}
</style>
