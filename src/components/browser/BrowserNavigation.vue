<template>
  <div class="browser-navigation flex items-center gap-2 px-4 py-2">
    <Button
      icon="pi pi-arrow-left"
      severity="secondary"
      size="small"
      @click="goBack"
    />

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
import Button from 'primevue/button';
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

const goBack = () => {
  const path = layoutStore.path.split('/');
  path.pop();
  layoutStore.path = path.join('/');
};
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
