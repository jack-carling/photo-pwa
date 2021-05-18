import { createStore } from 'vuex';

import mongoosy from 'mongoosy/frontend';
const { Login } = mongoosy;

const store = createStore({
  state: {
    user: {
      online: false,
    },
    messages: [],
  },
  mutations: {
    pushMessage(state, message) {
      state.messages.push(message);
    },
  },
  actions: {
    startChat(store) {
      let sse = new EventSource('/api/chat');
      sse.onmessage = (event) => {
        let message = JSON.parse(event.data);
        if (message.initial) return;
        store.commit('pushMessage', message);
      };
    },
    async login({ dispatch }, payload) {
      const res = await Login.login({ email: payload.email, password: payload.password });
      console.log(res);
      if (res._id) {
        dispatch('check');
      } else {
        // Handle incorrect info
      }
    },
    async check({ state }) {
      const user = (await Login.check()).js;
      if (user.status !== 'Not logged in') {
        state.user._id = user._id;
        state.user.email = user.email;
        state.user.name = user.name;
        state.user.online = true;
      }
    },
    async logout({ state }) {
      await Login.logout();
      for (const property of Object.getOwnPropertyNames(state.user)) {
        delete state.user[property];
      }
      state.user.online = false;
    },
  },
});

export default store;
