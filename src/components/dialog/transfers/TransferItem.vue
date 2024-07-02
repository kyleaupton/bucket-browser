<template>
  <div class="flex flex-col gap-2 p-4 rounded-lg border border-neutral-700">
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
      <div class="h-2 grow dark:bg-neutral-200 rounded">
        <div
          class="progress-bar-inner dark:bg-green-500 h-full rounded"
          :class="{ 'progress-bar-inner-paused': item.status === 'paused' }"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>
    </div>

    <div class="flex justify-end gap-8">
      <div v-if="item.status === 'running'" class="text-meta">
        {{ item.progress.eta }}
      </div>
      <div v-if="item.status === 'running'" class="text-meta">
        {{ item.progress.speed }}
      </div>
      <div class="text-meta">{{ statusText }}</div>
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
  return props.item.status !== 'running' ? 0 : props.item.progress.percentage;
});

const bytes = computed(
  () =>
    `${prettyBytes(props.item.progress.currentBytes)} / ${prettyBytes(props.item.progress.totalBytes)}`,
);

const prettyStatus = computed(() => {
  return props.item.status.charAt(0).toUpperCase() + props.item.status.slice(1);
});

const statusText = computed(() => {
  return props.item.status !== 'running' ? prettyStatus.value : bytes.value;
});
</script>

<style scoped>
.progress-bar-inner-paused {
  filter: grayscale(0.5);
}

.text-meta {
  @apply text-sm text-neutral-200;
}
</style>
