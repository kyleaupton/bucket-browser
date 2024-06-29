<template>
  <div class="browser-navigation flex items-center gap-2 p-2">
    <div
      class="nav-buttons h-8 inline-flex items-center justify-center rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-500"
    >
      <div class="nav-button-wrap rounded-l-lg">
        <div class="nav-button">
          <i class="pi pi-arrow-left" />
        </div>
      </div>

      <div class="nav-divider" />

      <div class="nav-button-wrap rounded-r-lg">
        <div class="nav-button">
          <i class="pi pi-arrow-right" />
        </div>
      </div>
    </div>

    <Select
      v-model="selected"
      class="w-full"
      size="small"
      :options="selectItems"
      option-label="name"
      variant="filled"
      checkmark
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Select from 'primevue/select';
import { useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();

const getItemPath = (itemName: string) => {
  const index = layoutStore.path.split('/').indexOf(itemName);

  return layoutStore.path
    .split('/')
    .slice(0, index + 1)
    .join('/');
};

const selectItems = computed(() => {
  const payload = [
    {
      type: 'connection',
      name: layoutStore.selectedConnection?.nickname || '',
      code: layoutStore.selectedConnection?.nickname || '',
    },
  ];

  payload.push(
    ...layoutStore.path
      .split('/')
      .slice(1)
      .map((item) => ({
        type: 'bucket/object',
        name: item,
        code: getItemPath(item),
      })),
  );

  return payload;
});

const selected = computed({
  get: () => {
    if (!layoutStore.path) {
      return {
        name: layoutStore.selectedConnection?.nickname || '',
        code: layoutStore.selectedConnection?.nickname || '',
        type: 'connection',
      };
    }

    const name = layoutStore.path.split('/').slice(-1)[0];
    return {
      name: name,
      code: getItemPath(name),
      type: 'bucket/object',
    };
  },
  set: (item: { code: string; name: string; type: string }) => {
    if (item.type === 'connection') {
      layoutStore.path = '';
    } else {
      layoutStore.path = item.code;
    }
  },
});
</script>

<style scoped>
.nav-divider {
  width: 1px;
  height: 18px;
  @apply dark:bg-neutral-500;
}

.nav-button-wrap {
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  @apply dark:hover:bg-neutral-700;
  @apply dark:active:bg-neutral-600;
  @apply h-full;
}
</style>

<style>
/* .browser-navigation .p-select {
  @apply bg-neutral-800;
} */
</style>
