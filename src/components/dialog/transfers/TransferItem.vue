<template>
  <div class="flex flex-col gap-2 p-4 rounded-lg border border-neutral-700">
    <div class="flex justify-between items-center gap-2 overflow-hidden">
      <div class="flex items-center gap-2 overflow-hidden">
        <img class="h-[32px] w-[32px]" :src="fileIcon" />
        <i :class="transferIcon"></i>
        <p class="truncate">{{ item.name }}</p>
      </div>
      <div class="flex gap-2">
        <Button
          v-if="item.status !== 'paused'"
          icon="pi pi-pause"
          severity="secondary"
          size="small"
          @click="pause"
        />
        <Button
          v-else
          icon="pi pi-play"
          severity="secondary"
          size="small"
          @click="resume"
        />
        <Button
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="cancel"
        />
      </div>
    </div>

    <div
      v-if="
        item.status === 'initializing' ||
        item.status === 'running' ||
        item.progress.percentage > 0
      "
      class="flex items-center gap-3"
    >
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
        {{ prettySpeed }}
      </div>
      <div class="text-meta">{{ statusText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import prettyBytes, { Options } from 'pretty-bytes';
import Button from 'primevue/button';
import { SerializedTransfer } from '@shared/types/transfers';
import { useLayoutStore } from '@/stores';
import { getExtension } from '@/utils';

const props = defineProps<{
  item: SerializedTransfer;
}>();

const layoutStore = useLayoutStore();

const fileIcon = computed(() => {
  const icon = layoutStore.fileIcons[getExtension(props.item.name)];
  return icon || layoutStore.defaultIcon;
});

const transferIcon = computed(() => {
  switch (props.item.type) {
    case 'download':
      return 'pi pi-arrow-circle-down';
    case 'upload':
      return 'pi pi-arrow-circle-up';
    default:
      return '';
  }
});

const percentage = computed(() => {
  return props.item.progress.totalBytes === 0
    ? 0
    : props.item.progress.percentage;
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

const prettySpeed = computed(() =>
  _prettyBytes(props.item.progress.speed, { bits: true }),
);

const _prettyBytes = (size: number, options?: Options) => {
  const _opts: Options = options || {};

  // @ts-expect-error - Says it's a read-only property but it's not
  _opts.minimumFractionDigits = 2;
  // @ts-expect-error - Says it's a read-only property but it's not
  _opts.maximumFractionDigits = 2;

  return prettyBytes(size, _opts);
};

const pause = () => window.ipcInvoke('/transfers/pause', props.item.id);
const resume = () => window.ipcInvoke('/transfers/resume', props.item.id);
const cancel = () => window.ipcInvoke('/transfers/cancel', props.item.id);
</script>

<style scoped>
.progress-bar-inner-paused {
  filter: grayscale(0.5);
}

.text-meta {
  @apply text-sm text-neutral-200;
}
</style>
