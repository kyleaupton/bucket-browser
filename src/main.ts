import { createApp } from 'vue';
import { createPinia } from 'pinia';
// @ts-expect-error - Does not have type definitions
import VueVirtualScroller from 'vue-virtual-scroller';
import App from './App.vue';
import 'primeicons/primeicons.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import './assets/index.css';

createApp(App)
  .use(createPinia())
  .use(VueVirtualScroller)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
