<template>
  <Titlebar />
  <Main />
  <Dialog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  useConnectionsStore,
  useLayoutStore,
  useTransfersStore,
} from '@/stores';
import Titlebar from '@/components/titlebar/Titlebar.vue';
import Main from '@/views/Main.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import { serialize } from './utils';

onMounted(async () => {
  // For now just force dark mode
  document.documentElement.classList.add('dark');

  const connectionsStore = useConnectionsStore();
  const layoutStore = useLayoutStore();
  const transfersStore = useTransfersStore();

  transfersStore.registerTransferEvents();
  connectionsStore.getConnections();
  layoutStore.getOs();
  layoutStore.getStandardIcons();

  window.serialize = serialize;

  window.onWindowState((state) => {
    layoutStore.windowState = state;
  });
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  /* @apply border; */
}
</style>
