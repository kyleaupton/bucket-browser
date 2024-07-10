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
    >
      <div class="inline-flex items-center gap-4">
        <div>{{ column.title }}</div>
        <i v-if="column.sortable" class="pi pi-sort-alt"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBrowserStore } from '@/stores';

const browserStore = useBrowserStore();
</script>

<style scoped></style>
