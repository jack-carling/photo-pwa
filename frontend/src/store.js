import { createStore } from 'vuex';

import mongoosy from 'mongoosy/frontend';
const { Login } = mongoosy;

let SSE;

const store = createStore({
  state: {
    user: {
      online: false,
    },
    accountError: '',
    locations: [],
    uploads: [],
    upload: {
      page: 1,
      total: 0,
      offset: 0,
    },
    namesInFeed: [],
    scrollPosition: 0,
    messages: [],
    photo: { data: '', isSaved: false },
    photoSettings: {},
    size: '',
    chat: { chatTarget: '', chatType: '' },
    image: {},
    chatName: '',
  },
  mutations: {
    pushMessage(state, message) {
      // Avoid private messages being pushed into non-private chats
      if (message.chatType === 'private') {
        if (message.chatTarget !== state.chat.chatTarget && message.user !== state.chat.chatTarget) return;
        state.messages.push(message);
      } else {
        state.messages.push(message);
      }
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
        state.chat.chatTarget = payload.room.toLowerCase();
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
    saveUploads(state, uploads) {
      state.uploads = [...state.uploads, ...uploads];
    },
    saveNewUploads(state, uploads) {
      state.uploads = [...uploads, ...state.uploads];
      state.scrollPosition = 0; // If you upload a picture you're brought to the top
    },
    increasePage(state) {
      state.upload.page++;
    },
    setUploadCount(state, count) {
      const currentCount = state.upload.total;
      if (currentCount !== count) {
        const offset = count - currentCount;
        state.upload.total = count;
        state.upload.offset = offset;
      }
    },
    resetUploadOffset(state) {
      state.upload.offset = 0;
    },
    addNamesToFeed(state, names) {
      state.namesInFeed = [...state.namesInFeed, ...names];
    },
    setChatName(state, name) {
      state.chatName = name;
    },
    scrollPosition(state, position) {
      state.scrollPosition = position;
    },
    setResultImage(state, image) {
      state.image = {};
      state.image = { ...image };
    },
  },
  actions: {
    startChat({ commit, state }) {
      SSE = new EventSource(`/api/chat?id=${state.user._id}`);
      SSE.onmessage = (event) => {
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
      if (SSE) SSE.close();
      await Login.logout();
      for (const property of Object.getOwnPropertyNames(state.user)) {
        delete state.user[property];
      }
      state.user.online = false;
    },
    async leaveRoom({ commit, state }) {
      if (state.chat.chatTarget !== '' && state.chat.chatType !== 'private') {
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
