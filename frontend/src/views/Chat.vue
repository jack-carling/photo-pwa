<template>
  <main ref="area">
    <article v-if="!chat.chatTarget">
      <button @click="joinRoom('stockholm', 'location')" class="btn cyan darken-1">Stockholm</button>
      <button @click="joinRoom('goteborg', 'location')" class="btn cyan darken-1">Göteborg</button>
    </article>

    <div v-for="(message, index) in messages" :key="index" class="chat-container">
      <span class="time">{{ displayTime(message.time, index) }}</span>
      <div :class="{ self: checkSelf(message) }">
        {{ message.message }}
        <span class="name" v-html="displayInfo(message.user)"></span>
      </div>
    </div>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { User, Message } = mongoosy;

export default {
  data() {
    return {
      names: {},
      timestamp: [],
    };
  },
  created() {
    if (!this.online) {
      this.$router.push('/account?redirect=chat');
    } else {
      this.$store.dispatch('startChat');
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    name() {
      return this.$store.state.user.name;
    },
    id() {
      return this.$store.state.user._id;
    },
    online() {
      return this.$store.state.user.online;
    },
    chat() {
      return this.$store.state.chat;
    },
  },
  methods: {
    scrollDown() {
      this.$refs.area.scrollTo({
        top: this.$refs.area.scrollHeight,
        behavior: 'smooth',
      });
    },
    checkSelf(message) {
      if (this.id === message.user) {
        return true;
      } else {
        return false;
      }
    },
    displayInfo(user) {
      return `${this.names[user]}`;
    },
    displayTime(time, index) {
      this.timestamp.push(time);
      const oldTime = this.timestamp[index - 1] ?? 0;
      const newTime = this.timestamp[index];
      const timePassed = newTime - oldTime;
      /* Only display timestamp if 15 minutes has passed (900000ms) */
      if (timePassed < 900000) return;
      time = new Date(time);
      const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      time = time.toLocaleString('se-SE', options);
      return time;
    },
    async getNames() {
      const set = new Set();
      this.messages.map((x) => set.add(x.user));

      const id = Array.from(set).pop();

      let names;

      if (!this.names.hasOwnProperty(id)) {
        names = await User.find();
      }

      if (names) {
        set.forEach((name) => {
          const found = names.find((x) => x._id === name);
          this.names[name] = found.name;
        });
      }
    },
    async joinRoom(room, type) {
      const payload = { room, type };
      this.$store.commit('setChatTarget', payload);
      let res = await fetch(`/api/chat/join/${this.chat.chatTarget}?id=${this.id}`);
      res = await res.json();
      if (res.success) {
        const messages = await Message.find({
          chatTarget: this.chat.chatTarget,
        });
        this.$store.commit('previousMessages', messages);
      }
    },
    async leaveRoom() {
      if (this.chat.chatTarget !== '') {
        let res = await fetch(`/api/chat/leave/${this.chat.chatTarget}?id=${this.id}`);
        res = await res.json();
        this.$store.commit('setChatTarget', false);
      }
    },
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.getNames();
          this.scrollDown();
        });
      },
    },
  },
  beforeUnmount() {
    this.leaveRoom();
  },
};
</script>

<style scoped>
div.chat-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}
div.chat-container div {
  word-wrap: break-word;
  color: #eceff1;
  background-color: #607d8b;
  width: max-content;
  font-size: 1.2rem;
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  position: relative;
}
div.chat-container div.self {
  align-self: flex-end;
  background-color: #00acc1;
}
div.chat-container:last-of-type {
  margin-bottom: 0.5rem;
}
div.chat-container div span.name {
  font-size: 0.8rem;
  position: absolute;
  bottom: -1.2rem;
  left: 0.5rem;
  white-space: nowrap;
  color: initial;
}
div.chat-container div.self span.name {
  left: auto;
  right: 0.5rem;
}
span.time {
  margin-bottom: 0.2rem;
  text-align: center;
}
</style>
