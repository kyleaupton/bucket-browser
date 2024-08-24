<template>
  <Titlebar />
  <Main />
  <Dialog />
</template>

<script setup lang="ts">
import {
  useConnectionsStore,
  useLayoutStore,
  useTransfersStore,
} from '@/stores';
import Titlebar from '@/components/Titlebar.vue';
import Main from '@/views/Main.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import { serialize } from './utils';

// For now just force dark mode
document.documentElement.classList.add('dark');

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();
const transfersStore = useTransfersStore();

connectionsStore.getConnections();
layoutStore.getStandardIcons();
layoutStore.getOs();
transfersStore.registerTransferEvents();

window.serialize = serialize;
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
