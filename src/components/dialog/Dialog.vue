<template>
  <Connection v-if="layoutStore.dialog?.name === 'connection'" />
  <Transfers v-else-if="layoutStore.dialog?.name === 'transfers'" />
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores';
import Connection from './Connection.vue';
import Transfers from './transfers/Transfers.vue';

const layoutStore = useLayoutStore();
</script>

<style scoped></style>
