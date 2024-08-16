<template>
  <!-- Wrapper -->
  <div class="flex justify-center items-center h-full w-full">
    <!-- Error card -->
    <div
      class="flex flex-col justify-center items-center gap-2 p-4 rounded-xl dark:bg-neutral-700"
    >
      <!-- Title row -->
      <div class="flex gap-2">
        <i
          class="pi pi-exclamation-circle dark:text-red-600"
          :style="{ fontSize: '1.5rem' }"
        ></i>
        <div>Whoops! Something went wrong</div>
      </div>
      <!-- Body row -->
      <div class="flex flex-col">
        <div>Error: {{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBrowserStore } from '@/stores';

const browserStore = useBrowserStore();
const { error } = storeToRefs(browserStore);

const message = computed(() => {
  if (error.value instanceof Error) {
    // If the error is from the S3 client, it
    // will have a name of `AggregateError`
    if (error.value.name === 'AggregateError') {
      // @ts-expect-error - AggregateError has a `code` property
      return error.value.code;
    }

    return error.value.message;
  }

  return `${error.value}`;
});
</script>

<style scoped></style>
