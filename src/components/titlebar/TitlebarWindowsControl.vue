<template>
  <div id="window-controls">
    <div id="min-button" class="button" @click="min">
      <span>&#xE921;</span>
    </div>
    <div
      v-if="layoutStore.windowState === 'unmaximized'"
      id="max-button"
      class="button"
      @click="max"
    >
      <span>&#xE922;</span>
    </div>
    <div v-else id="restore-button" class="button" @click="restore">
      <span>&#xE923;</span>
    </div>
    <div id="close-button" class="button" @click="close">
      <span>&#xE8BB;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();

const min = (): void => {
  window.ipcInvoke('/window/min');
};

const max = (): void => {
  window.ipcInvoke('/window/max');
};

const restore = (): void => {
  window.ipcInvoke('/window/restore');
};

const close = (): void => {
  window.ipcInvoke('/window/close');
};
</script>

<style scoped>
#titlebar {
  color: #fff;
}

#window-controls {
  display: grid;
  grid-template-columns: repeat(3, 46px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  font-family: 'Segoe MDL2 Assets';
  font-size: 10px;
}

#window-controls .button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
#window-controls #min-button {
  grid-column: 1;
}
#window-controls #max-button,
#window-controls #restore-button {
  grid-column: 2;
}
#window-controls #close-button {
  grid-column: 3;
}

#window-controls {
  -webkit-app-region: no-drag;
}

#window-controls .button {
  user-select: none;
  cursor: default;
}
#window-controls .button:hover {
  background: rgba(255, 255, 255, 0.1);
}
#window-controls .button:active {
  background: rgba(255, 255, 255, 0.2);
}

#close-button:hover {
  background: #e81123 !important;
}
#close-button:active {
  background: #f1707a !important;
  color: #000;
}
</style>
