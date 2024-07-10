<template>
  <Titlebar />
  <Main />
  <Dialog />
  <ContextMenu />
</template>

<script setup lang="ts">
import Titlebar from '@/components/Titlebar.vue';
import Main from '@/views/Main.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import {
  useConnectionsStore,
  useLayoutStore,
  useTransfersStore,
} from '@/stores';
import { serialize } from './utils';

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
  @apply bg-neutral-950;
}
</style>
