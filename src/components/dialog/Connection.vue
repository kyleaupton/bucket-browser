<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="title"
    :style="{ width: '25rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="name" class="font-semibold w-24">Name</label>
      <InputText
        id="name"
        v-model="persistedConnection.nickname"
        class="flex-auto"
        size="small"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="endpoint" class="font-semibold w-24">Endpoint</label>
      <InputText
        id="endpoint"
        v-model="persistedConnection.config.endpoint"
        class="flex-auto"
        size="small"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="access-key" class="font-semibold w-24">Access Key</label>
      <InputText
        id="access-key"
        v-model="persistedConnection.config.credentials.accessKeyId"
        class="flex-auto"
        size="small"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="secret-key" class="font-semibold w-24">Secret Key</label>
      <InputText
        id="secret-key"
        v-model="persistedConnection.config.credentials.secretAccessKey"
        class="flex-auto"
        size="small"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="path-style" class="font-semibold">Force Path Style</label>
      <ToggleSwitch
        id="path-style"
        v-model="persistedConnection.config.forcePathStyle"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="layoutStore.closeDialog()"
      ></Button>
      <Button
        type="button"
        label="Save"
        severity="contrast"
        :disabled="disabled"
        @click="save"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { nanoid } from 'nanoid';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ToggleSwitch from 'primevue/toggleswitch';
import Button from 'primevue/button';
import { PersistedConnection } from '@shared/types/connections';
import {
  useLayoutStore,
  useConnectionsStore,
  Dialog as t_Dialog,
  DialogConnection,
} from '@/stores';

const layoutStore = useLayoutStore();
const connectionsStore = useConnectionsStore();
const { dialog } = storeToRefs(layoutStore);

const isConnectionDialog = (dialog: t_Dialog): dialog is DialogConnection => {
  return dialog?.name === 'connection';
};

const visible = computed<boolean>({
  get: () => {
    return dialog.value !== undefined && isConnectionDialog(dialog.value);
  },
  set: (val: boolean) => {
    if (val === false) {
      layoutStore.closeDialog();
    }
  },
});

const _dialog = computed(() => {
  return (visible.value ? dialog.value : undefined) as
    | DialogConnection
    | undefined;
});

const defaultConnection: PersistedConnection = {
  id: nanoid(),
  nickname: '',
  config: {
    region: 'us-east-1',
    endpoint: 'https://s3.amazonaws.com',
    credentials: {
      accessKeyId: '',
      secretAccessKey: '',
    },
  },
};

let persistedConnection = ref<PersistedConnection>(defaultConnection);

watch(visible, () => {
  if (_dialog?.value?.data) {
    persistedConnection = ref<PersistedConnection>(
      ...window.serialize(_dialog.value.data),
    );
  } else {
    persistedConnection.value = defaultConnection;
  }
});

const newConnection = computed(() => _dialog?.value?.data === undefined);

const disabled = computed(() => {
  return (
    !persistedConnection.value.nickname ||
    !persistedConnection.value.config.endpoint
  );
});

const title = computed(() =>
  newConnection.value ? 'New Connection' : 'Edit Connection',
);

const save = async () => {
  if (newConnection.value) {
    await connectionsStore.addConnection(persistedConnection.value);
  } else {
    await connectionsStore.editConnection(persistedConnection.value);
  }

  layoutStore.closeDialog();
};
</script>

<style scoped></style>
