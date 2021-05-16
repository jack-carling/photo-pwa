import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: {
      online: false,
      name: '',
    },
    messages: [],
  },
  mutations: {
    pushMessage(state, message) {
      state.messages.push(message);
    },
    setName(state, name) {
      state.user.name = name;
      console.log(state.user.name);
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
  },
});

export default store;
