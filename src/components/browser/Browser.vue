<template>
  <div
    v-if="!selectedConnection"
    class="h-full select-none flex justify-center items-center"
  >
    <div>No Connection Selected</div>
  </div>
  <div
    v-else-if="!items.length"
    class="h-full select-none flex justify-center items-center"
  >
    <div>No Items</div>
  </div>

  <div v-else class="flex flex-col h-full">
    <BrowserNavigation />
    <div class="flex-grow overflow-hidden mb-2">
      <VirtualScroller class="h-full" :items="items" :item-size="48">
        <template #item="{ item }">
          <BrowserItem :item="item" />
        </template>
      </VirtualScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import VirtualScroller from 'primevue/virtualscroller';
import { Bucket, _Object, CommonPrefix } from '@aws-sdk/client-s3';
import {
  listBucketsChannel,
  listObjectsChannel,
} from '@shared/ipc/connections';
import { useLayoutStore } from '@/stores';
import BrowserNavigation from './BrowserNavigation.vue';
import BrowserItem from './BrowserItem.vue';

const layoutStore = useLayoutStore();
const { path, selectedConnection } = storeToRefs(layoutStore);

const items = ref<(Bucket | _Object | CommonPrefix)[]>([]);
const selectedBucket = computed(() => path.value.split('/')[1]);
const selectedObject = computed(() => path.value.split('/').slice(2).join('/'));

watch(selectedConnection, () => fetchItems());
watch(path, () => fetchItems());

const fetchItems = async () => {
  if (selectedConnection.value) {
    if (!selectedBucket.value) {
      const { Buckets } = await window.ipcInvoke(
        listBucketsChannel,
        selectedConnection.value.id,
      );

      items.value = Buckets || [];
    } else {
      const { Contents, CommonPrefixes } = await window.ipcInvoke(
        listObjectsChannel,
        selectedConnection.value.id,
        {
          Bucket: selectedBucket.value,
          Prefix: selectedObject.value ? `${selectedObject.value}/` : '',
          Delimiter: '/',
        },
      );

      const _contents = Contents || [];
      const _commonPrefixes = CommonPrefixes || [];

      await layoutStore.getFileIcons(_contents);

      items.value = [..._commonPrefixes, ..._contents];
    }
  }
};
</script>

<style scoped></style>
