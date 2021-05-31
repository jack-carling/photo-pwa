import { createApp } from 'vue';
import App from './App.vue';

import router from './router.js';
import store from './store.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err));
}

createApp(App).use(router).use(store).mount('#app');
