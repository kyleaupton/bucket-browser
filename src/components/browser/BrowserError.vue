<template>
  <!-- Wrapper -->
  <div class="flex justify-center items-center h-full w-full p-12">
    <!-- Error card -->
    <div
      class="flex flex-col justify-center items-center gap-6 p-6 rounded-xl max-w-screen-sm bg-muted"
    >
      <!-- Title row -->
      <div class="flex gap-2">
        <i
          class="pi pi-exclamation-circle text-destructive"
          :style="{ fontSize: '1.5rem' }"
        ></i>
        <div>Something went wrong</div>
      </div>
      <!-- Body row -->
      <div class="flex flex-col">
        <div>Error: {{ message }}</div>
      </div>
      <!-- Action row -->
      <div>
        <Button @click="openEditConnection">Edit Connection</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBrowserStore, useLayoutStore } from '@/stores';
import { Button } from '@/components/ui/button';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();
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

  // return 'really long error message that is too long to fit in the card just like this one right here that is too long to fit in the card';
});

const openEditConnection = (): void => {
  layoutStore.setDialog({
    name: 'connection',
    edit: layoutStore.selectedConnectionId,
  });
};
</script>

<style scoped></style>
