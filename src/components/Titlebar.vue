<template>
  <div class="titlebar-drag relative h-12 shrink-0 flex justify-between p-2">
    <div
      class="absolute flex gap-2 box-border h-12 p-2 -m-2"
      :class="{ 'left-[74px]': macosTitlebar }"
    >
      <Button
        class="titlebar-nodrag"
        icon="pi pi-bars"
        severity="secondary"
        size="small"
        @click="toggleSidebar"
      />
      <Button
        class="titlebar-nodrag"
        icon="pi pi-plus"
        severity="secondary"
        size="small"
        @click="showNewConnection"
      />
    </div>

    <div class="mx-auto flex gap-2 w-1/2 max-w-screen-md">
      <Button
        class="titlebar-nodrag"
        icon="pi pi-arrow-left"
        severity="secondary"
        size="small"
        @click="goBack"
      />

      <Select
        v-model="selected"
        class="titlebar-nodrag titlebar-select w-full"
        size="small"
        :options="selectItems"
        option-label="name"
        variant="filled"
        checkmark
      />
    </div>

    <div class="absolute flex right-2 h-12 p-2 -m-2">
      <Button
        class="titlebar-nodrag"
        icon="pi pi-arrow-right-arrow-left"
        severity="secondary"
        size="small"
        @click="showTransfers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { useLayoutStore } from '@/stores';
import { emitter } from '@/emitter';

const layoutStore = useLayoutStore();

const macosTitlebar = computed(() => layoutStore.os === 'darwin');

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

const showTransfers = () => layoutStore.setDialog({ name: 'transfers' });
const showNewConnection = () => layoutStore.setDialog({ name: 'connection' });
const toggleSidebar = () => emitter.emit('toggle-sidebar');
</script>

<style scoped>
.titlebar-drag {
  -webkit-app-region: drag;
}

.titlebar-nodrag {
  -webkit-app-region: no-drag;
}
</style>

<style>
.titlebar-select .p-select-label {
  padding: 0;
  display: flex;
  align-items: center;
  @apply px-3;
}
</style>
