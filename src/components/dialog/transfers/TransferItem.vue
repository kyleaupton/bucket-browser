<template>
  <div class="flex flex-col gap-2 p-4 rounded-lg border">
    <div class="flex justify-between items-center">
      <p>{{ item.name }}</p>
      <div class="flex gap-2">
        <Button
          :icon="item.status === 'paused' ? 'pi pi-play' : 'pi pi-pause'"
          severity="secondary"
          size="small"
        />
        <Button icon="pi pi-times" severity="secondary" size="small" />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="progress-bar-outer">
        <div
          class="progress-bar-inner"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>
    </div>

    <div class="flex justify-end">
      <div class="text-sm">{{ bytes }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import prettyBytes from 'pretty-bytes';
import Button from 'primevue/button';
import { SerializedTransfer } from '@shared/types/transfers';

const props = defineProps<{
  item: SerializedTransfer;
}>();

const percentage = computed(() => {
  return props.item.status === 'initializing'
    ? 0
    : props.item.progress.percentage;
});

const bytes = computed(
  () =>
    `${prettyBytes(props.item.progress.currentBytes)} / ${prettyBytes(props.item.progress.totalBytes)}`,
);
</script>

<style scoped>
.progress-bar-outer {
  flex-grow: 1;
  height: 0.5rem;
  background-color: #f1f1f1;
  border-radius: 0.25rem;
}

.progress-bar-inner {
  height: 100%;
  background-color: #4caf50;
  border-radius: 0.25rem;
}
</style>
