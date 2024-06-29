<template>
  <div class="browser-navigation flex h-13 gap-2 p-2">
    <div
      class="nav-buttons inline-flex items-center justify-center rounded-xl dark:bg-neutral-800 dark:border dark:border-neutral-500"
    >
      <div class="nav-button-wrap rounded-l-xl">
        <div class="nav-button">
          <i class="pi pi-arrow-left" />
        </div>
      </div>

      <div class="nav-divider" />

      <div class="nav-button-wrap rounded-r-xl">
        <div class="nav-button">
          <i class="pi pi-arrow-right" />
        </div>
      </div>
    </div>

    <Select
      class="w-full"
      size="small"
      :options="selectItems"
      option-label="name"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Select from 'primevue/select';
import { useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();

const selectItems = computed(() =>
  layoutStore.path
    .split('/')
    .slice(1)
    .map((item) => ({ name: item, code: item })),
);
</script>

<style scoped>
.nav-divider {
  width: 1px;
  height: 18px;
  @apply dark:bg-neutral-500;
}

.nav-button-wrap {
  padding: 4px 8px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  @apply dark:hover:bg-neutral-700;
  @apply dark:active:bg-neutral-600;
  @apply h-full;
}
</style>

<style>
.browser-navigation .p-select {
  @apply bg-neutral-800;
}
</style>
