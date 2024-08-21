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
        variant="ghost"
        size="icon"
        @click="toggleSidebar"
      >
        <Menu class="size-4" />
      </Button>
    </div>

    <div class="flex gap-2 w-1/2">
      <Button
        class="titlebar-nodrag h-8 w-8 flex-shrink-0"
        variant="ghost"
        size="icon"
        @click="goBack"
      >
        <ArrowLeft class="size-4" />
      </Button>
      <Button
        class="titlebar-nodrag h-8 w-8 flex-shrink-0"
        variant="ghost"
        size="icon"
        @click="goBack"
      >
        <ArrowRight class="size-4" />
      </Button>
      <!-- <Select v-model="selected.code">
        <SelectTrigger class="titlebar-nodrag h-8">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="item in selectItems"
              :key="item.code"
              :value="item.code"
            >
              {{ item.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> -->
    </div>

    <div class="absolute flex gap-2 right-2 h-12 p-2 -m-2">
      <Button
        class="titlebar-nodrag h-8 w-8"
        variant="ghost"
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
  SelectLabel,
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
