<template>
  <div class="browser-header flex items-center border-b rounded-t-lg">
    <div
      v-for="column of browserStore.columns"
      :key="column.key"
      class="p-3"
      :class="{
        'cursor-pointer select-none transition-colors hover:bg-muted/60':
          column.sortable,
      }"
      :style="column.style"
      @click="handleClick(column)"
    >
      <div class="inline-flex items-center gap-4">
        <div class="text-sm font-medium">{{ column.title }}</div>
        <template v-if="browserStore.sort.key === column.key">
          <ArrowUpNarrowWide
            v-if="browserStore.sort.order === 'asc'"
            class="size-4"
          />
          <ArrowDownWideNarrow
            v-else-if="browserStore.sort.order === 'desc'"
            class="size-4"
          />
        </template>
        <ArrowUpDown v-else-if="column.sortable" class="size-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-vue-next';
import { useBrowserStore, Column } from '@/stores';

const browserStore = useBrowserStore();

const handleClick = (column: Column) => {
  if (column.sortable) {
    browserStore.setSort(column.key);
  }
};
</script>

<style scoped></style>
