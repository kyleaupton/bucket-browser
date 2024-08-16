<template>
  <div class="h-full rounded-lg dark:bg-neutral-900">
    <!-- No connection selected -->
    <div
      v-if="!selectedConnection"
      class="h-full w-full flex justify-center items-center text-neutral-300"
    >
      <div>No Connection Selected</div>
    </div>

    <!-- Error -->
    <BrowserError v-if="browserStore.error" />

    <BrowserTable v-else />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBrowserStore, useLayoutStore } from '@/stores';
import BrowserError from './BrowserError.vue';
import BrowserTable from './BrowserTable.vue';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
const { path, selectedConnection } = storeToRefs(layoutStore);

watch(selectedConnection, () => {
  browserStore.error = null;
  browserStore.fetchItems({ clearPageMarkers: true });
});
watch(path, () => browserStore.fetchItems({ clearPageMarkers: true }));
</script>
