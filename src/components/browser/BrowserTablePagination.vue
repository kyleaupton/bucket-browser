<template>
  <div
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useBrowserStore } from '@/stores';

const browserStore = useBrowserStore();
const { currentPage, pageMarkers } = storeToRefs(browserStore);

const nextPageDisabled = computed(
  () => !pageMarkers.value.get(currentPage.value + 1),
);
const prevPageDisabled = computed(() => currentPage.value === 1);

const nextPage = () => browserStore.fetchItems({ nextPage: true });
const prevPage = () => browserStore.fetchItems({ prevPage: true });
</script>

<style>
.p-button.page-button {
  padding: 2px 8px;
}
</style>
