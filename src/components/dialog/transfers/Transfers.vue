<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Transfers"
    :style="{ width: '80vw' }"
  >
    <div v-if="transfersArray.length" class="flex flex-col gap-2">
      <TransferItem
        v-for="item in transfersArray"
        :key="item.id"
        :item="item"
      />
    </div>
    <div v-else>
      <div class="flex justify-center items-center h-24">
        <p>No transfers</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import Dialog from 'primevue/dialog';
import { useLayoutStore, useTransfersStore } from '@/stores';
import TransferItem from './TransferItem.vue';

const layoutStore = useLayoutStore();
const transfersStore = useTransfersStore();
const { dialog } = storeToRefs(layoutStore);
const { transfers } = storeToRefs(transfersStore);

const visible = computed({
  get: () => {
    return dialog?.value?.name === 'transfers';
  },
  set: (val: boolean) => {
    if (val === false) {
      layoutStore.closeDialog();
    }
  },
});

const transfersArray = computed(() => Object.values(transfers.value));
</script>

<style scoped></style>
