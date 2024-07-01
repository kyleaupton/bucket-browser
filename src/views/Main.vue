<template>
  <div class="main border-t dark:border-neutral-600">
    <SplitterGroup id="splitter-group-1" direction="horizontal">
      <SplitterPanel id="splitter-panel-1" :size="35" :min-size="20">
        <Sidebar />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-resize-handle-1"
        class="w-[1px] dark:bg-neutral-600"
      />
      <SplitterPanel id="splitter-panel-2" :size="65" :min-size="65">
        <Browser />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';

import Sidebar from '@/components/sidebar/Sidebar.vue';
import Browser from '@/components/browser/Browser.vue';
</script>

<style scoped>
.main {
  height: 100%;
  max-height: calc(100dvh - 3rem); /* 3rem is hight of titlebar */
}
</style>
