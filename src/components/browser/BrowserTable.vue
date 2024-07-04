<template>
  <DataTable
    v-model:selection="selected"
    class="browser-table"
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
        <div>
          {{
            data.type === 'object' && data.size != null
              ? prettyBytes(data.size)
              : '--'
          }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import prettyBytes from 'pretty-bytes';
import { useLayoutStore } from '@/stores';
import { getExtension } from '@/utils';
import { Item } from './utils';

const props = defineProps<{
  items: Item[];
}>();

const layoutStore = useLayoutStore();

const selected = ref<Item | undefined>();

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
  /* width: 100px;
  min-width: 100px; */
  /* word-break: break-all; */
  text-align: right;
  white-space: nowrap;
}
</style>
