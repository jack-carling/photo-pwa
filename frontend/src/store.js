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
    size: '',
    chat: { chatTarget: '', chatType: '' },
  },
  mutations: {
    pushMessage(state, message) {
      state.messages.push(message);
    },
    previousMessages(state, messages) {
      state.messages = [...messages];
    },
    setChatTarget(state, payload) {
      if (!payload) {
        state.messages = [];
        state.chat.chatTarget = '';
        state.chat.chatType = '';
      } else {
        state.chat.chatTarget = payload.room;
        state.chat.chatType = payload.type;
      }
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
    saveSize(state, size) {
      state.size = size;
    },
  },
  actions: {
    startChat({ commit, state }) {
      let sse = new EventSource(`/api/chat?id=${state.user._id}`);
      sse.onmessage = (event) => {
        let message = JSON.parse(event.data);
        if (message.initial) return;
        commit('pushMessage', message);
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
    async leaveRoom({ commit, state }) {
      if (state.chat.chatTarget !== '' && state.chat.chatType !== 'private') {
        /*let extraQuery = '';
        if (state.chat.chatType === 'location' || state.chat.chatType === 'tag') {
          extraQuery = `&type=${state.chat.chatType}`;
        }*/
        let res = await fetch(
          `/api/chat/leave/${state.chat.chatTarget}?id=${state.user.id}&type=${state.chat.chatType}`
        );
        res = await res.json();
        commit('setChatTarget', false);
      }
    },
  },
});

export default store;
