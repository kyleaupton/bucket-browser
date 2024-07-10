<template>
  <div class="flex flex-col h-full overflow-hidden">
    <BrowserTableColumns />
    <BrowserTableItems />
    <BrowserTablePagination v-if="browserStore.isTruncated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useBrowserStore } from '@/stores';
import BrowserTableColumns from './BrowserTableColumns.vue';
import BrowserTableItems from './BrowserTableItems.vue';
import BrowserTablePagination from './BrowserTablePagination.vue';
import 'overlayscrollbars/overlayscrollbars.css';

const browserStore = useBrowserStore();

onMounted(() => {
  const target = document.getElementById('browser-scroller-wrapper');
  const viewport = document.getElementById('browser-scroller');

  if (target && viewport) {
    OverlayScrollbars(
      {
        target,
        elements: {
          viewport,
        },
      },
      {
        scrollbars: {
          theme: 'os-theme-light',
        },
      },
    );
  }
});
</script>

<style scoped>
.browser-header {
  flex-shrink: 0;
}
</style>
