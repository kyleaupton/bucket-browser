<template>
  <div class="relative h-full w-full">
    <DataTable
      v-model:selection="selected"
      class="browser-table rounded-lg"
      :value="props.items"
      selection-mode="single"
      scroll-height="100%"
      scrollable
      removable-sort
    >
      <Column class="browser-table-td-icon">
        <template #body="{ data }">
          <img class="h-[32px] w-[32px]" :src="getItemIcon(data)" />
        </template>
      </Column>
      <Column class="browser-table-td-name" header="Name" field="name" sortable>
        <template #body="{ data }">
          <div class="truncate">{{ data.name }}</div>
        </template>
      </Column>
      <Column class="browser-table-td-size" header="Size" field="size" sortable>
        <template #body="{ data }">
          <div v-if="data.type === 'object' && data.size != null">
            {{ prettyBytes(data.size) }}
          </div>
          <div v-else>--</div>
        </template>
      </Column>
      <Column class="browser-table-td-more">
        <template #body="{ data }">
          <Button
            icon="pi pi-ellipsis-h"
            severity="secondary"
            size="small"
            @click="(e) => toggleMenu(e, data)"
          />
        </template>
      </Column>
    </DataTable>

    <ProgressSpinner
      v-if="browserStore.loading"
      class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style="position: absolute; width: 50px; height: 50px"
      stroke-width="6"
      animation-duration=".5s"
    />

    <div
      v-else-if="!items.length && !browserStore.fetching"
      class="absolute select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-300"
    >
      No Items
    </div>

    <Menu id="overlay_menu" ref="menu" :model="menuOptions" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import ProgressSpinner from 'primevue/progressspinner';
import prettyBytes from 'pretty-bytes';
import { addTransferChannel } from '@shared/ipc/transfers';
import { useLayoutStore, useBrowserStore } from '@/stores';
import { getExtension } from '@/utils';
import { Item } from './utils';

const props = defineProps<{
  items: Item[];
}>();

const layoutStore = useLayoutStore();
const browserStore = useBrowserStore();

const selected = ref<Item | undefined>();
const menu = ref();
const menuItem = ref<Item | undefined>();
const menuOptions = ref([
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

          if (
            connection &&
            menuItem.value &&
            menuItem.value.type === 'object' &&
            bucket
          ) {
            await window.ipcInvoke(addTransferChannel, {
              connectionId: connection.id,
              downloadPath: `/Users/kyleupton/Downloads/${menuItem.value.name}`,
              clientOptions: {
                Bucket: bucket,
                Key: menuItem.value.key,
              },
            });

            layoutStore.setDialog({ name: 'transfers' });
          }
        },
      },
    ],
  },
]);

watch(selected, (item) => {
  if (item) {
    if (item.type !== 'object') {
      layoutStore.path = `${layoutStore.path}/${item.name}`;
    }

    selected.value = undefined;
  }
});

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

const toggleMenu = (event: MouseEvent, item: Item) => {
  menuItem.value = item;
  menu.value.toggle(event);
};
</script>

<style scoped>
.browser-table.p-datatable {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>

<style>
.browser-table .p-datatable-table-container {
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.browser-table .p-datatable-selectable-row {
  background: none;
}

.browser-table thead,
.browser-table th {
  @apply dark:bg-neutral-900;
}

.browser-table .browser-table-td-icon {
  width: 32px;
  min-width: 32px;
  padding: 12px;
  box-sizing: content-box;
}

.browser-table .browser-table-td-name {
  width: 100%;
  max-width: 1px;
  padding-right: 0;
}

.browser-table .browser-table-td-size {
  white-space: nowrap;
}

.browser-table .p-datatable-empty-message {
  display: none;
}
</style>
