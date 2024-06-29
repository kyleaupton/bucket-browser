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

  <div v-else class="h-full p-2 overflow-scroll">
    <BucketItem v-for="item of items" :key="getKeyName(item)" :item="item" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Bucket, _Object, CommonPrefix } from '@aws-sdk/client-s3';
import {
  listBucketsChannel,
  listObjectsChannel,
} from '@shared/ipc/connections';
import { useLayoutStore } from '@/stores';
import { getKeyName } from './utils';
import BucketItem from './BrowserItem.vue';

const layoutStore = useLayoutStore();
const { path } = storeToRefs(layoutStore);

const items = ref<(Bucket | _Object | CommonPrefix)[]>([]);
// The path is a bit overloaded.
// It looks like the following: /connection-id/bucket-name/object-name/foo/bar
const selectedConnection = computed(() => path.value.split('/')[1]);
const selectedBucket = computed(() => path.value.split('/')[2]);
const selectedObject = computed(() => path.value.split('/').slice(3).join('/'));

watch(path, async () => {
  console.log(path.value);
  if (selectedConnection.value) {
    if (!selectedBucket.value) {
      console.log('fetching bucket');
      const { Buckets } = await window.ipcInvoke(
        listBucketsChannel,
        selectedConnection.value,
      );

      items.value = Buckets || [];
    } else {
      console.log('fetching object');
      console.log('Bucket', selectedBucket.value);
      console.log(
        'Prefix',
        selectedObject.value ? `${selectedObject.value}/` : '',
      );

      const res = await window.ipcInvoke(
        listObjectsChannel,
        selectedConnection.value,
        {
          Bucket: selectedBucket.value,
          Prefix: selectedObject.value ? `${selectedObject.value}/` : '',
          Delimiter: '/',
        },
      );

      console.log(res);

      const _contents = res.Contents || [];
      const _commonPrefixes = res.CommonPrefixes || [];
      items.value = [..._commonPrefixes, ..._contents];
    }
  }

  console.log(items.value);
});
</script>

<style scoped></style>
