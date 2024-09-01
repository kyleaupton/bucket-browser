<template>
  <div id="browser-scroller-wrapper" class="relative grow h-full">
    <BrowserLoading v-if="loading" />
    <BrowserEmpty v-else-if="!fetching && !items.length" />

    <RecycleScroller
      id="browser-scroller"
      v-slot="{ item }"
      class="h-full w-full rounded-b-lg"
      :items="itemsSorted"
      :item-size="57"
      key-field="key"
    >
      <BrowserTableItem :item="item" />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBrowserStore } from '@/stores';
import BrowserLoading from './BrowserLoading.vue';
import BrowserEmpty from './BrowserEmpty.vue';
import BrowserTableItem from './BrowserTableItem.vue';

const browserStore = useBrowserStore();
const { loading, fetching, items, itemsSorted } = storeToRefs(browserStore);
</script>

<style scoped></style>
