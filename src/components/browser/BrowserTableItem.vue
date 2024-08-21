<template>
  <div
    class="flex items-center overflow-hidden select-none transition-colors cursor-pointer border-b hover:bg-muted/60"
    @click.self="handleNavigation(item)"
  >
    <!-- Img -->
    <div class="p-3" :style="columns[0].style" @click="handleNavigation(item)">
      <img class="h-[32px] w-[32px]" :src="getItemIcon(item)" />
    </div>

    <!-- Name -->
    <div
      class="p-3 truncate text-sm font-medium"
      :style="columns[1].style"
      @click="handleNavigation(item)"
    >
      {{ item.name }}
    </div>

    <!-- Size -->
    <div
      class="p-3 text-sm"
      :style="columns[2].style"
      @click="handleNavigation(item)"
    >
      <div v-if="item.type === 'object' && item.size != null">
        {{ prettyBytes(item.size) }}
      </div>
      <div v-else>--</div>
    </div>

    <!-- More -->
    <div class="flex justify-center pr-4" :style="columns[3].style">
      <Button
        class="h-8 w-8"
        variant="ghost"
        size="icon"
        @click="(e) => toggleMenu(e, item)"
      >
        <Ellipsis class="size-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import prettyBytes from 'pretty-bytes';
import { Ellipsis } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ipcInvoke } from '@/ipc';
import { useBrowserStore, useLayoutStore } from '@/stores';
import { getExtension } from '@/utils';
import { Item } from './utils';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();

const { columns } = storeToRefs(browserStore);

defineProps<{
  item: Item;
}>();

const getItemIcon = (item: Item) => {
  if (item.type === 'bucket') {
    return layoutStore.bucketIcon;
  } else if (item.type === 'folder') {
    return layoutStore.folderIcon;
  } else if (item.type === 'object') {
    const ext = getExtension(item.name);

    if (ext) {
      const icon = layoutStore.fileIcons[ext];

      if (icon) {
        return icon;
      }
    }
  }

  return layoutStore.defaultIcon;
};

const handleNavigation = (item: Item) => {
  if (item.type !== 'object') {
    layoutStore.path = `${layoutStore.path}/${item.name}`;
  }
};

const toggleMenu = (event: MouseEvent, item: Item) => {
  layoutStore.contextMenuOptions = [
    {
      label: 'Download',
      icon: 'pi pi-arrow-circle-down',
      command: async () => {
        const path = layoutStore.path;
        const bucket = path.split('/')[1];
        const connection = layoutStore.selectedConnection;

        if (connection && item.type === 'object' && bucket) {
          await ipcInvoke('/transfers/add', {
            connectionId: connection.id,
            downloadPath: `/Users/kyleupton/Downloads/${item.name}`,
            clientOptions: {
              Bucket: bucket,
              Key: item.key,
            },
          });

          layoutStore.setDialog({ name: 'transfers' });
        }
      },
    },
  ];

  layoutStore.contextMenu.toggle(event);
};
</script>

<style scoped></style>
