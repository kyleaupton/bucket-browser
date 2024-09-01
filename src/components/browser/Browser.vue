<template>
  <div class="h-full rounded-lg">
    <!-- No connection selected -->
    <div
      v-if="selectedConnectionId === undefined"
      class="h-full w-full flex justify-center items-center text-neutral-300"
    >
      <div class="text-sm text-muted-foreground">No Connection Selected</div>
    </div>

    <!-- Error -->
    <BrowserError v-if="error" />

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
const { path, selectedConnectionId } = storeToRefs(layoutStore);
const { error } = storeToRefs(browserStore);

watch(selectedConnectionId, () => {
  browserStore.error = null;
  browserStore.fetchItems({ clearPageMarkers: true });
});
watch(path, () => browserStore.fetchItems({ clearPageMarkers: true }));
</script>
