import { createStore } from 'vuex';

import mongoosy from 'mongoosy/frontend';
const { Login } = mongoosy;

const store = createStore({
  state: {
    user: {
      online: false,
    },
    accountError: '',
    locations: [],
    messages: [],
    photo: { data: '', isSaved: false },
    photoSettings: {},
  },
  mutations: {
    pushMessage(state, message) {
      state.messages.push(message);
    },
    clearErrors(state) {
      state.accountError = '';
    },
    saveLocations(state, locations) {
      if (locations) {
        state.locations = locations;
      } else {
        state.locations = [];
      }
    },
    savePhoto(state, photo) {
      if (!photo) {
        state.photo.data = '';
        state.photo.isSaved = false;
      } else {
        state.photo.data = photo;
        state.photo.isSaved = true;
      }
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
    async login({ state, dispatch }, payload) {
      const res = await Login.login({ email: payload.email, password: payload.password });
      if (res._id) {
        dispatch('check');
      } else {
        state.accountError = res.error;
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
