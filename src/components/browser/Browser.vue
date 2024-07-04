<template>
  <div
    v-if="!selectedConnection"
    class="h-full select-none flex justify-center items-center"
  >
    <div>No Connection Selected</div>
  </div>

  <div v-else class="flex flex-col h-full">
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
      <div v-else class="flex flex-col h-full w-full">
        <div
          v-if="!items.length && !fetching"
          class="h-full w-full select-none flex justify-center items-center"
        >
          No Items
        </div>
        <RecycleScroller
          v-else
          v-slot="{ item }"
          class="h-full w-full py-2"
          :items="items"
          :item-size="48"
          key-field=""
        >
          <BrowserItem :item="item" />
        </RecycleScroller>
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
import ProgressSpinner from 'primevue/progressspinner';
import { useBrowserStore, useLayoutStore } from '@/stores';
import BrowserItem from './BrowserItem.vue';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
const { loading, fetching, items, isTruncated, currentPage, pageMarkers } =
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
