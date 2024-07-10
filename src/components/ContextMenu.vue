<template>
  <Menu
    id="overlay_menu"
    ref="contextMenu"
    :model="contextMenuOptions"
    :popup="true"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Menu from 'primevue/menu';
import { useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();
const { contextMenu, contextMenuOptions } = storeToRefs(layoutStore);
</script>

<style scoped></style>
