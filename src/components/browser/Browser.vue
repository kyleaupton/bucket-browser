<template>
  <div class="h-full rounded-lg dark:bg-neutral-900">
    <div
      v-if="!selectedConnection"
      class="h-full w-full flex justify-center items-center text-neutral-300"
    >
      <div>No Connection Selected</div>
    </div>

    <BrowserTable v-else />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBrowserStore, useLayoutStore } from '@/stores';
import BrowserTable from './BrowserTable.vue';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
const { path, selectedConnection } = storeToRefs(layoutStore);

watch(selectedConnection, () =>
  browserStore.fetchItems({ clearPageMarkers: true }),
);
watch(path, () => browserStore.fetchItems({ clearPageMarkers: true }));
</script>
