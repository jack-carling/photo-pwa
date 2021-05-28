import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Camera from './views/Camera.vue';
import Chat from './views/Chat.vue';
import Account from './views/Account.vue';
import Search from './views/Search.vue';
import Result from './views/Result.vue';
import Upload from './views/Upload.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/camera',
      component: Camera,
    },
    {
      path: '/chat',
      component: Chat,
    },
    {
      path: '/account',
      component: Account,
    },
    {
      path: '/search',
      component: Search,
    },
    {
      path: '/result',
      component: Result,
    },
    {
      path: '/upload',
      component: Upload,
    },
  ],
});

export default router;
