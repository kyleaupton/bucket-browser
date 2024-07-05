<template>
  <div
    v-if="!selectedConnection"
    class="h-full select-none flex justify-center items-center rounded-lg dark:bg-neutral-900"
  >
    <div class="text-neutral-300">No Connection Selected</div>
  </div>

  <div v-else class="flex flex-col h-full rounded-lg dark:bg-neutral-900">
    <div class="flex flex-grow overflow-hidden">
      <div class="flex flex-col h-full w-full">
        <BrowserTable :items="items" />
        <div
          v-if="isTruncated"
          class="flex justify-between items-center p-2 border-t dark:border-neutral-700"
        >
          <Button
            class="page-button"
            label="Prev"
            icon="pi pi-arrow-left"
            size="small"
            :disabled="prevPageDisabled"
            @click="prevPage"
          />
          <div>Page {{ currentPage }}</div>
          <Button
            class="page-button"
            label="Next"
            icon="pi pi-arrow-right"
            icon-pos="right"
            size="small"
            :disabled="nextPageDisabled"
            @click="nextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useBrowserStore, useLayoutStore } from '@/stores';
import BrowserTable from './BrowserTable.vue';
// import BrowserItem from './BrowserItem.vue';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
const { items, isTruncated, currentPage, pageMarkers } =
  storeToRefs(browserStore);
const { path, selectedConnection } = storeToRefs(layoutStore);

watch(selectedConnection, () =>
  browserStore.fetchItems({ clearPageMarkers: true }),
);
watch(path, () => browserStore.fetchItems({ clearPageMarkers: true }));

const nextPageDisabled = computed(
  () => !pageMarkers.value.get(currentPage.value + 1),
);

const prevPageDisabled = computed(() => currentPage.value === 1);

const nextPage = () => browserStore.fetchItems({ nextPage: true });
const prevPage = () => browserStore.fetchItems({ prevPage: true });
</script>

<style>
.p-virtualscroller {
  height: 100% !important;
  width: 100% !important;
}

.p-virtualscroller .p-virtualscroller-content {
  width: 100%;
}

.p-button.page-button {
  padding: 2px 8px;
}
</style>
