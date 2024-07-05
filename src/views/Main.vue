<template>
  <div class="main m-3 rounded" :class="{ 'ml-0': sidebar?.isCollapsed }">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="sidebar"
    >
      <SplitterPanel
        id="splitter-panel-1"
        ref="sidebar"
        :size="35"
        :min-size="20"
        :collapsed-size="0"
        collapsible
      >
        <Sidebar />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-resize-handle-1"
        class="w-3 bg-transparent"
      />
      <SplitterPanel id="splitter-panel-2" :size="65" :min-size="65">
        <Browser />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Browser from '@/components/browser/Browser.vue';
import { emitter } from '@/emitter';

const sidebar = ref<InstanceType<typeof SplitterPanel>>();

const toggleSidebar = () => {
  sidebar.value?.isCollapsed
    ? sidebar.value?.expand()
    : sidebar.value?.collapse();
};

emitter.on('toggle-sidebar', toggleSidebar);
</script>

<style scoped>
.main {
  height: 100%;
  max-height: calc(100dvh - 3rem - 1.5rem); /* 3rem is hight of titlebar */
}
</style>
