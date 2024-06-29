<template>
  <Titlebar />
  <Main />
  <Dialog />
</template>

<script setup lang="ts">
import Titlebar from '@/components/Titlebar.vue';
import Main from '@/views/Main.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import { useConnectionsStore, useLayoutStore } from '@/stores';
import { serialize } from './utils';

const connectionsStore = useConnectionsStore();
const layoutStore = useLayoutStore();

connectionsStore.getConnections();
layoutStore.getIcons();

window.serialize = serialize;
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
</style>
