<template>
  <div
    class="browser-header flex items-center border-b rounded-t-lg border-neutral-700"
  >
    <div
      v-for="column of browserStore.columns"
      :key="column.key"
      class="p-4"
      :class="{
        'cursor-pointer select-none dark:hover:bg-neutral-800': column.sortable,
      }"
      :style="column.style"
      @click="handleClick(column)"
    >
      <div class="inline-flex items-center gap-4">
        <div>{{ column.title }}</div>
        <template v-if="browserStore.sort.key === column.key">
          <i
            v-if="browserStore.sort.order === 'asc'"
            class="pi pi-sort-amount-up"
          ></i>
          <i
            v-else-if="browserStore.sort.order === 'desc'"
            class="pi pi-sort-amount-down"
          ></i>
        </template>
        <i v-else-if="column.sortable" class="pi pi-sort-alt"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBrowserStore, Column } from '@/stores';

const browserStore = useBrowserStore();

const handleClick = (column: Column) => {
  if (column.sortable) {
    browserStore.setSort(column.key);
  }
};
</script>

<style scoped></style>
