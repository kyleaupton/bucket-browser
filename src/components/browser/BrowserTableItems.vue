<template>
  <div id="browser-scroller-wrapper" class="grow h-full">
    <RecycleScroller
      id="browser-scroller"
      v-slot="{ item }"
      class="h-full w-full rounded-b-lg"
      :items="browserStore.itemsSorted"
      :item-size="57"
      key-field="key"
    >
      <BrowserTableItem :item="item" />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { useBrowserStore } from '@/stores';
import BrowserTableItem from './BrowserTableItem.vue';

const browserStore = useBrowserStore();
</script>

<style scoped></style>
