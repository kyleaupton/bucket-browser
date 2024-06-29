<template>
  <div class="px-4">
    <div
      class="flex items-center justify-between h-[48px] gap-2 p-2 rounded-lg cursor-pointer select-none dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      @click="handleClick"
    >
      <div class="flex gap-2 items-center">
        <img class="h-[32px] w-[32px]" :src="thumbnail" />
        <div>{{ getKeyName(item) }}</div>
      </div>

      <!-- <i class="pi pi-ellipsis-h"></i> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores';
import { getKeyName, isBucket, isFolder, Item } from './utils';
import { computed } from 'vue';

const props = defineProps<{
  item: Item;
}>();

const layoutStore = useLayoutStore();

const thumbnail = computed(() => {
  if (isBucket(props.item)) {
    return layoutStore.bucketIcon;
  } else if (isFolder(props.item)) {
    return layoutStore.folderIcon;
  } else {
    const ext = (getKeyName(props.item) || '').split('.').pop();
    return layoutStore.fileIcons[ext || ''];
  }
});

const handleClick = () => {
  layoutStore.path = `${layoutStore.path}/${getKeyName(props.item)}`;
};
</script>

<style scoped></style>
