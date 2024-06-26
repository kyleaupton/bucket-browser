<template>
  <div
    v-if="!selectedConnection"
    class="h-full select-none flex justify-center items-center"
  >
    <div>No Connection Selected</div>
  </div>

  <div v-else class="flex flex-col h-full py-2">
    <div class="flex flex-grow overflow-hidden">
      <div
        v-if="loading"
        class="h-full w-full flex justify-center items-center"
      >
        <ProgressSpinner
          style="width: 50px; height: 50px"
          stroke-width="6"
          animation-duration=".5s"
        />
      </div>
      <div
        v-else-if="!items.length && !fetching"
        class="h-full w-full select-none flex justify-center items-center"
      >
        <div>No Items</div>
      </div>
      <RecycleScroller
        v-else
        v-slot="{ item }"
        class="h-full w-full"
        :items="items"
        :item-size="48"
        key-field=""
      >
        <BrowserItem :item="item" />
      </RecycleScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import ProgressSpinner from 'primevue/progressspinner';
import { Bucket, _Object, CommonPrefix } from '@aws-sdk/client-s3';
import {
  listBucketsChannel,
  listObjectsChannel,
} from '@shared/ipc/connections';
import { useLayoutStore } from '@/stores';
import BrowserItem from './BrowserItem.vue';

const layoutStore = useLayoutStore();
const { path, selectedConnection } = storeToRefs(layoutStore);

const loading = ref(false);
const fetching = ref(false);
const items = ref<(Bucket | _Object | CommonPrefix)[]>([]);
const selectedBucket = computed(() => path.value.split('/')[1]);
const selectedObject = computed(() => path.value.split('/').slice(2).join('/'));

watch(selectedConnection, () => fetchItems());
watch(path, () => fetchItems());

const fetchItems = async () => {
  if (selectedConnection.value) {
    items.value = [];
    fetching.value = true;

    // Only display spinner if fetching takes longer than .5 second
    const timeout = setTimeout(() => {
      loading.value = true;
    }, 500);

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

    loading.value = false;
    clearTimeout(timeout);
  }
};
</script>

<style>
.p-virtualscroller {
  height: 100% !important;
  width: 100% !important;
}

.p-virtualscroller .p-virtualscroller-content {
  width: 100%;
}
</style>
