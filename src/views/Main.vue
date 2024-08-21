<template>
  <div class="main rounded">
    <ResizablePanelGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="sidebar"
    >
      <ResizablePanel
        id="splitter-panel-1"
        ref="sidebar"
        :class="cn(isCollapsed && 'transition-all duration-300 ease-in-out')"
        :size="35"
        :min-size="20"
        collapsible
      >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle id="splitter-resize-handle-1" with-handle />
      <ResizablePanel id="splitter-panel-2" :size="65" :min-size="65">
        <Browser />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Browser from '@/components/browser/Browser.vue';
import { emitter } from '@/emitter';
import { cn } from '@/lib/utils';

const sidebar = ref<InstanceType<typeof ResizablePanel>>();

const isCollapsed = computed(() => sidebar.value?.isCollapsed);

const toggleSidebar = () => {
  isCollapsed.value ? sidebar.value?.expand() : sidebar.value?.collapse();
};

emitter.on('toggle-sidebar', toggleSidebar);
</script>

<style scoped>
.main {
  height: 100%;
  max-height: calc(100dvh - 3rem); /* 3rem is hight of titlebar */
}
</style>
