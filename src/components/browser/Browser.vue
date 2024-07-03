<template>
  <div
    v-if="!selectedConnection"
    class="h-full select-none flex justify-center items-center"
  >
    <div>No Connection Selected</div>
  </div>

  <div v-else class="flex flex-col h-full py-2">
    <div class="flex flex-grow overflow-hidden">
      <div
        v-if="loading"
        class="h-full w-full flex justify-center items-center"
      >
        <ProgressSpinner
          style="width: 50px; height: 50px"
          stroke-width="6"
          animation-duration=".5s"
        />
      </div>
      <div
        v-else-if="!items.length && !fetching"
        class="h-full w-full select-none flex justify-center items-center"
      >
        <div>No Items</div>
      </div>
      <RecycleScroller
        v-else
        v-slot="{ item }"
        class="h-full w-full"
        :items="items"
        :item-size="48"
        key-field=""
      >
        <BrowserItem :item="item" />
      </RecycleScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import ProgressSpinner from 'primevue/progressspinner';
import { useBrowserStore, useLayoutStore } from '@/stores';
import BrowserItem from './BrowserItem.vue';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
const { loading, fetching, items } = storeToRefs(browserStore);
const { path, selectedConnection } = storeToRefs(layoutStore);

watch(selectedConnection, browserStore.fetchItems);
watch(path, browserStore.fetchItems);
</script>

<style>
.p-virtualscroller {
  height: 100% !important;
  width: 100% !important;
}

.p-virtualscroller .p-virtualscroller-content {
  width: 100%;
}
</style>
