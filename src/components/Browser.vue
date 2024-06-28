<template>
  <div class="h-full select-none flex justify-center items-center">
    {{ selectedConnection || 'None selected' }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Bucket } from '@aws-sdk/client-s3';
import { listBucketsChannel } from '@shared/ipc/connections';
import { useConnectionsStore } from '@/stores/connections';

const { selectedConnection } = storeToRefs(useConnectionsStore());

const buckets = ref<Bucket[]>([]);

watch(selectedConnection, async () => {
  if (selectedConnection.value) {
    try {
      const res = await window.ipcInvoke(
        listBucketsChannel,
        selectedConnection.value,
      );

      buckets.value = res.Buckets || [];
      console.log(buckets.value);
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<style scoped></style>
