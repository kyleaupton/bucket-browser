<template>
  <Dialog v-model:open="visible">
    <DialogContent class="connection-dialog overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-3" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Connection Name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="accessKeyId">
          <FormItem>
            <FormLabel>Accses Key</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="secretAccessKey">
          <FormItem>
            <FormLabel>Secret Key</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="endpoint">
          <FormItem>
            <FormLabel>Endpoint</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
            <FormDescription>
              The endpoint of the S3-compatible storage service. For AWS S3, the
              default endpoint is <code>https://s3.amazonaws.com</code>.
            </FormDescription>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="region">
          <FormItem>
            <FormLabel>Region</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
            <FormDescription
              >Region of the AWS S3 service endpoint. For S3-compatible storage
              services other than AWS, <code>us-east-1</code> will usually
              work.</FormDescription
            >
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="forcePathStyle">
          <FormItem class="mt-2">
            <div class="flex items-center gap-4">
              <FormLabel>Force Path Style</FormLabel>
              <FormControl>
                <Switch
                  class="!mt-0"
                  :checked="value === 1"
                  @update:checked="(value) => handleChange(value ? 1 : 0)"
                />
              </FormControl>
            </div>
            <FormDescription>
              Force the use of path-style URLs. This is required for most S3
              services that are not AWS.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter class="mt-3">
          <DialogClose as-child>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NewconnectionWithSecret } from '@shared/types/connections';
import {
  useLayoutStore,
  useConnectionsStore,
  useBrowserStore,
  Dialog as t_Dialog,
  DialogConnection,
} from '@/stores';

const layoutStore = useLayoutStore();
const connectionsStore = useConnectionsStore();
const { dialog } = storeToRefs(layoutStore);

const isConnectionDialog = (dialog: t_Dialog): dialog is DialogConnection => {
  return dialog?.name === 'connection';
};

//
// Computed
//
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

const connectionIdToEdit = computed(() => _dialog?.value?.edit);
const connectionToEdit = computed(() =>
  connectionIdToEdit.value !== undefined
    ? connectionsStore.getConnection(connectionIdToEdit.value)
    : undefined,
);

const title = computed(() =>
  connectionToEdit.value ? 'Edit Connection' : 'New Connection',
);

const description = computed(() =>
  connectionToEdit.value
    ? 'Edit the connection to an S3-compatible storage service.'
    : 'Create a new connection to an S3-compatible storage service.',
);

//
// Form
//
const initialValues: NewconnectionWithSecret | undefined =
  connectionToEdit.value
    ? {
        name: connectionToEdit.value.name,
        accessKeyId: connectionToEdit.value.accessKeyId,
        secretAccessKey: connectionToEdit.value.secretAccessKey || '',
        region: connectionToEdit.value.region,
        endpoint: connectionToEdit.value.endpoint,
        forcePathStyle: connectionToEdit.value.forcePathStyle,
      }
    : undefined;

const form = useForm<NewconnectionWithSecret>({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1),
      accessKeyId: z.string().min(1),
      secretAccessKey: z.string().min(1),
      region: z.string().min(1).default('us-east-1'),
      endpoint: z.string().min(1).default('https://s3.amazonaws.com'),
      forcePathStyle: z.number().default(0),
    }),
  ),
  initialValues,
});

//
// Methods
//
const onSubmit = form.handleSubmit(async (values) => {
  if (connectionToEdit.value) {
    await connectionsStore.editConnection(connectionToEdit.value.id, values);
  } else {
    await connectionsStore.addConnection(values);
  }

  // If connection is selected, fetch items
  if (layoutStore.selectedConnectionId === connectionToEdit.value?.id) {
    const browserStore = useBrowserStore();
    browserStore.fetchItems();
  }

  layoutStore.closeDialog();
});
</script>

<style>
.connection-dialog {
  max-height: calc(100vh - 4rem);
}
</style>
