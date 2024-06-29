<template>
  <div>
    <div v-for="index in 20" :key="index" class="mx-4 p-2 flex gap-2">
      <Skeleton width="36px" height="32px" class="h-2 w-2" />
      <Skeleton height="32px" class="h-2 w-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<style scoped></style>
