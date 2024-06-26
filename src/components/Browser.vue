<template>
  <div class="h-full select-none flex justify-center items-center">
    {{ selectedConnection || 'None selected' }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { listBucketsChannel } from '@shared/ipc/connections';
import { useConnectionsStore } from '@/stores/connections';

const { selectedConnection } = storeToRefs(useConnectionsStore());

const buckets = ref([]);

if (selectedConnection) {
  watch(selectedConnection, async () => {
    if (selectedConnection.value) {
      const res = await window.ipcInvoke(
        listBucketsChannel,
        selectedConnection.value,
      );

      console.log(res);
    }
  });
}
</script>

<style scoped></style>
