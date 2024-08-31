<template>
  <div
    ref="itemElement"
    class="flex items-center overflow-hidden select-none transition-colors cursor-pointer border-b hover:bg-muted/60"
    :class="[{ '!bg-muted': showContextMenu }]"
    @click.self="handleNavigation"
    @contextmenu="toggleRightClick"
  >
    <!-- Img -->
    <div class="p-3" :style="columns[0].style" @click="handleNavigation">
      <img class="h-[32px] w-[32px]" :src="itemIcon" />
    </div>

    <!-- Name -->
    <div
      class="p-3 truncate text-sm font-medium"
      :style="columns[1].style"
      @click="handleNavigation"
    >
      {{ item.name }}
    </div>

    <!-- Size -->
    <div
      class="p-3 text-sm"
      :style="columns[2].style"
      @click="handleNavigation"
    >
      <div v-if="item.type === 'object' && item.size != null">
        {{ prettyBytes(item.size) }}
      </div>
      <div v-else>--</div>
    </div>

    <!-- More -->
    <div class="flex justify-center pr-4" :style="columns[3].style">
      <div ref="buttonElement" class="flex">
        <Button
          class="h-8 w-8"
          variant="ghost"
          size="icon"
          @click="toggleThreeDots"
        >
          <Ellipsis class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, VNode } from 'vue';
import { storeToRefs } from 'pinia';
import prettyBytes from 'pretty-bytes';
import { Ellipsis, Download, FolderOpen } from 'lucide-vue-next';
import { createContextMenu } from '@/contextMenu';
import { Button } from '@/components/ui/button';
import { ipcInvoke } from '@/ipc';
import { useBrowserStore, useLayoutStore } from '@/stores';
import { getExtension } from '@/utils';
import { Item } from './utils';

const browserStore = useBrowserStore();
const layoutStore = useLayoutStore();

const { columns } = storeToRefs(browserStore);

const props = defineProps<{
  item: Item;
}>();

const itemElement = ref<HTMLElement>();
const buttonElement = ref<HTMLElement>();
const showContextMenu = ref(false);

const itemIcon = computed(() => {
  if (props.item.type === 'bucket') {
    return layoutStore.bucketIcon;
  } else if (props.item.type === 'folder') {
    return layoutStore.folderIcon;
  } else if (props.item.type === 'object') {
    const ext = getExtension(props.item.name);

    if (ext) {
      const icon = layoutStore.fileIcons[ext];

      if (icon) {
        return icon;
      }
    }
  }

  return layoutStore.defaultIcon;
});

const handleNavigation = (): void => {
  if (props.item.type !== 'object') {
    layoutStore.path = `${layoutStore.path}/${props.item.name}`;
  }
};

const contextItemsObject = [
  {
    render: (): VNode =>
      h('div', { class: 'w-44' }, [
        h(Download, { class: 'mr-2 h-4 w-4' }),
        h('div', 'Download'),
      ]),
    command: async (): Promise<void> => {
      const path = layoutStore.path;
      const bucket = path.split('/')[1];
      const connection = layoutStore.selectedConnection;

      if (connection && props.item.type === 'object' && bucket) {
        await ipcInvoke('/transfers/add', {
          connectionId: connection.id,
          downloadPath: `/Users/kyleupton/Downloads/${props.item.name}`,
          clientOptions: {
            Bucket: bucket,
            Key: props.item.key,
          },
        });

        layoutStore.setDialog({ name: 'transfers' });
      }
    },
  },
];

const contextItemsDirectory = [
  {
    render: (): VNode =>
      h('div', { class: 'w-44' }, [
        h(FolderOpen, { class: 'mr-2 h-4 w-4' }),
        h('div', 'Open'),
      ]),
    command: (): void => {
      handleNavigation();
    },
  },
];

const contextItems =
  props.item.type === 'object' ? contextItemsObject : contextItemsDirectory;

const toggleThreeDots = (event: MouseEvent): void => {
  createContextMenu(event, contextItems, {
    anchor: 'bottom',
    target: buttonElement.value,
    onOpen: () => {
      showContextMenu.value = true;
    },
    onClose: () => {
      showContextMenu.value = false;
    },
  });
};

const toggleRightClick = (event: MouseEvent): void => {
  createContextMenu(event, contextItems, {
    anchor: 'bottom',
    target: itemElement.value,
    onOpen: () => {
      showContextMenu.value = true;
    },
    onClose: () => {
      showContextMenu.value = false;
    },
  });
};
</script>

<style scoped></style>
