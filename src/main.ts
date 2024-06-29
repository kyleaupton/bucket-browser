import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
// @ts-expect-error - Does not have type definitions
import VueVirtualScroller from 'vue-virtual-scroller';
import App from './App.vue';
import 'primeicons/primeicons.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import './style.css';

createApp(App)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        primary: 'noir',
      },
    },
  })
  .use(VueVirtualScroller)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
