import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';

import './style.css';

createApp(App)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
