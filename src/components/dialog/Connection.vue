<template>
  <Dialog v-model:open="visible">
    <DialogContent class="connection-dialog overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-3" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="nickname">
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

        <FormField v-slot="{ componentField }" name="config.endpoint">
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

        <FormField v-slot="{ componentField }" name="config.region">
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

        <FormField
          v-slot="{ value, handleChange }"
          name="config.forcePathStyle"
        >
          <FormItem class="mt-2">
            <div class="flex items-center gap-4">
              <FormLabel>Force Path Style</FormLabel>
              <FormControl>
                <Switch
                  class="!mt-0"
                  :checked="value"
                  @update:checked="handleChange"
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
import { nanoid } from 'nanoid';
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
import { NewConnection } from '@shared/types/connections';
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

const connection = computed(() => _dialog?.value?.data);

const title = computed(() =>
  connection.value ? 'Edit Connection' : 'New Connection',
);

const description = computed(() =>
  connection.value
    ? 'Edit the connection to an S3-compatible storage service.'
    : 'Create a new connection to an S3-compatible storage service.',
);

//
// Form
//
const formSchema = toTypedSchema(
  z.object({
    id: z.string().default(nanoid),
    nickname: z.string().min(1),
    accessKeyId: z.string().min(1),
    secretAccessKey: z.string().min(1),
    config: z.object({
      region: z.string().min(1).default('us-east-1'),
      endpoint: z.string().min(1).default('https://s3.amazonaws.com'),
      forcePathStyle: z.boolean().default(false),
    }),
  }),
);

const initialValues: NewConnection | undefined = connection.value
  ? {
      id: connection.value.id,
      nickname: connection.value.nickname,
      accessKeyId: connection.value.accessKeyId,
      secretAccessKey: connection.value.secretAccessKey || '',
      config: {
        region: connection.value.config.region,
        endpoint: connection.value.config.endpoint,
        forcePathStyle: connection.value.config.forcePathStyle,
      },
    }
  : undefined;

const form = useForm({
  validationSchema: formSchema,
  initialValues,
});

//
// Methods
//
const onSubmit = form.handleSubmit(async (values) => {
  if (connection.value) {
    await connectionsStore.editConnection(values);
  } else {
    await connectionsStore.addConnection(values);
  }

  layoutStore.closeDialog();
});
</script>

<style>
.connection-dialog {
  max-height: calc(100vh - 2rem);
}
</style>
