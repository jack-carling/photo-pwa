import { createApp } from 'vue';
import App from './App.vue';

import router from './router.js';
import store from './store.js';

createApp(App).use(router).use(store).mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceWorker.js');
}

//dispatch? store.dispatch(' ? ');
