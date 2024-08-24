<template>
  <div
    class="z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  >
    <RenderOption
      v-for="(o, i) in options"
      :key="i"
      class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent"
      :option="o"
      @click="o.command"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType } from 'vue';
import { Option } from '@/contextMenu';

defineProps<{
  options: Option[];
}>();

const RenderOption = defineComponent({
  props: {
    option: {
      type: Object as PropType<Option>,
      required: true,
    },
  },
  render() {
    return this.option.render();
  },
});
</script>

<style scoped></style>
