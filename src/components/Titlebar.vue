<template>
  <div
    class="titlebar-drag relative h-12 shrink-0 flex justify-center items-center border-b bg-[--background]"
  >
    <div
      class="absolute flex gap-2 h-12 p-2 -m-2"
      :class="{ 'left-[74px]': macosTitlebar }"
    >
      <Button
        class="titlebar-nodrag h-8 w-8"
        variant="outline"
        size="icon"
        @click="toggleSidebar"
      >
        <Menu class="size-4" />
      </Button>
    </div>

    <div class="flex gap-2 w-1/2">
      <Button
        class="titlebar-nodrag h-8 w-8 flex-shrink-0"
        variant="outline"
        size="icon"
        @click="goBack"
      >
        <ArrowLeft class="size-4" />
      </Button>
      <Button
        class="titlebar-nodrag h-8 w-8 flex-shrink-0"
        variant="outline"
        size="icon"
        @click="goBack"
      >
        <ArrowRight class="size-4" />
      </Button>
      <Select v-model="selected" :disabled="!selected">
        <SelectTrigger
          class="titlebar-nodrag h-8 disabled:opacity-100 disabled:cursor-default"
        >
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="item in selectItems"
              :key="item.path"
              :value="item.path"
            >
              {{ item.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div class="absolute flex gap-2 right-2 h-12 p-2 -m-2">
      <Button
        class="titlebar-nodrag h-8 w-8"
        variant="outline"
        size="icon"
        @click="showTransfers"
      >
        <ArrowLeftRight class="size-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, ArrowLeft, ArrowRight, ArrowLeftRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface SelectableItems {
  type: string;
  label: string;
  path: string;
}

const selectItems = computed((): SelectableItems[] => {
  const payload: SelectableItems[] = [];

  if (!layoutStore.selectedConnection) {
    return payload;
  }

  payload.push({
    type: 'connection',
    label: layoutStore.selectedConnection.nickname,
    path: '<current_connection>',
  });

  payload.push(
    ...layoutStore.path
      .split('/')
      .slice(1)
      .map((item) => ({
        type: 'bucket/object',
        label: item,
        path: getItemPath(item),
      })),
  );

  return payload;
});

const selected = computed<string>({
  get: () => {
    if (!layoutStore.selectedConnection) {
      return '';
    } else if (!layoutStore.path) {
      return '<current_connection>';
    }

    const name = layoutStore.path.split('/').slice(-1)[0];
    return getItemPath(name);
  },
  set: (path: string) => {
    if (path === '<current_connection>') {
      layoutStore.path = '';
    } else {
      layoutStore.path = path;
    }
  },
});

const goBack = () => {
  const path = layoutStore.path.split('/');
  path.pop();
  layoutStore.path = path.join('/');
};

const showTransfers = () => layoutStore.setDialog({ name: 'transfers' });
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
