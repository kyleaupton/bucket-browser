<template>
  <div class="flex justify-between items-center p-2 border-t">
    <Button
      class="h-8 w-8"
      size="icon"
      :disabled="prevPageDisabled"
      @click="prevPage"
    >
      <ArrowLeft />
    </Button>
    <div>Page {{ currentPage }}</div>
    <Button
      class="h-8 w-8"
      size="icon"
      :disabled="nextPageDisabled"
      @click="nextPage"
    >
      <ArrowRight />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
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
