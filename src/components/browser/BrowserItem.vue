<template>
  <div class="browser-item px-2 overflow-hidden">
    <div
      class="flex overflow-hidden items-center justify-between h-[48px] gap-2 p-2 rounded-lg cursor-pointer select-none dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      @click.self="handleClick"
    >
      <div class="flex gap-2 items-center overflow-hidden" @click="handleClick">
        <img class="h-[32px] w-[32px]" :src="thumbnail" />
        <div class="truncate">{{ getKeyName(item) }}</div>
      </div>

      <div
        class="browser-item-icon justify-center items-center p-[3px] rounded-lg"
        @click="toggleMenu"
      >
        <i class="pi pi-ellipsis-h"></i>
      </div>
    </div>
  </div>

  <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Menu from 'primevue/menu';
import { addTransferChannel } from '@shared/ipc/transfers';
import { useLayoutStore } from '@/stores';
import { getKeyName, isBucket, isFolder, isObject, Item } from './utils';
import { computed } from 'vue';

const props = defineProps<{
  item: Item;
}>();

const layoutStore = useLayoutStore();

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Download',
        icon: 'pi pi-arrow-circle-down',
        command: async () => {
          const path = layoutStore.path;
          const bucket = path.split('/')[1];
          const connection = layoutStore.selectedConnection;

          if (connection && isObject(props.item) && bucket) {
            await window.ipcInvoke(addTransferChannel, {
              connectionId: connection.id,
              downloadPath: `/Users/kyleupton/Downloads/${getKeyName(props.item)}`,
              clientOptions: {
                Bucket: bucket,
                Key: props.item.Key,
              },
            });

            layoutStore.setDialog({ name: 'transfers' });
          }
        },
      },
    ],
  },
]);

const thumbnail = computed(() => {
  if (isBucket(props.item)) {
    return layoutStore.bucketIcon;
  } else if (isFolder(props.item)) {
    return layoutStore.folderIcon;
  } else {
    const ext = (getKeyName(props.item) || '').split('.').pop();

    if (ext) {
      const icon = layoutStore.fileIcons[ext];

      if (icon) {
        return icon;
      }
    }

    return layoutStore.defaultIcon;
  }
});

const handleClick = () => {
  if (isObject(props.item)) {
    return;
  }

  layoutStore.path = `${layoutStore.path}/${getKeyName(props.item)}`;
};

const toggleMenu = (event: MouseEvent) => {
  menu.value.toggle(event);
};
</script>

<style scoped>
.browser-item-icon {
  display: none;
}

.browser-item:hover .browser-item-icon {
  display: flex;
}
</style>
