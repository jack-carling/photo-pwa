<template>
  <main ref="area" :class="{ 'no-margin-padding': !chat.chatTarget }">
    <section class="target" v-if="!chat.chatTarget">
      <div class="target" v-for="(chat, i) in chats" :key="i" @click="joinRoom(chat.target, chat.type)">
        <article class="animate__animated animate__fadeInLeft">
          <div class="icon" v-html="displayIcon(chat.type, chat.target)"></div>
          <span v-if="chat.type === 'private'"> {{ displayInfo(chat.target) }}</span>
          <span v-else-if="chat.type === 'photo'"> {{ displayPhotoInfo(chat.target) }}</span>
          <span v-else>{{ chat.target }}</span>
        </article>
      </div>
    </section>

    <section v-else>
      <div v-for="(message, index) in messages" :key="index" class="chat-container">
        <span class="time animate__animated animate__fadeInDown">{{ displayTime(message.time, index) }}</span>
        <div
          class="animate__animated"
          :class="[checkSelf(message) ? 'self animate__fadeInRight' : 'animate__fadeInLeft']"
        >
          {{ message.message }}
          <span class="name" v-html="displayInfo(message.user)"></span>
        </div>
      </div>
    </section>

    <section v-if="!messages.length" :class="{ hide: !fetchedChats }" class="no-chats">
      <div>
        <i class="material-icons">question_answer</i>
        <p>
          Your chat history looks empty! Try to
          <a @click="$router.push('/search')">search</a>
          for something fun to talk about!
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { User, Message, Upload } = mongoosy;

import { convertTime } from '../services/time.js';

export default {
  data() {
    return {
      names: {},
      images: {},
      photoNames: [],
      timestamp: [],
      chats: [],
      fetchedChats: false,
      scrollBehavior: 'auto',
    };
  },
  created() {
    if (!this.online) {
      this.$router.push('/account?redirect=chat');
    } else {
      this.$store.dispatch('startChat');
      this.getChats();
    }
  },
  mounted() {
    if (this.online) {
      this.startQueryChat();
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
        behavior: this.scrollBehavior,
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
      if (this.names[user] === undefined) {
        return '';
      } else {
        return `${this.names[user]}`;
      }
    },
    displayTime(time, index) {
      this.timestamp.push(time);
      const oldTime = this.timestamp[index - 1] ?? 0;
      const newTime = this.timestamp[index];
      const timePassed = newTime - oldTime;
      // Only display timestamp if 15 minutes has passed (900000ms)
      if (timePassed < 900000) return;
      setTimeout(() => {
        this.scrollDown(); // Avoid scroll down bug when time is rendered
      }, 100);
      return convertTime(time);
    },
    displayPhotoInfo(target) {
      if (this.images.length) {
        let currentUser = false;
        let { name } = this.images.find((x) => x.id === target);
        name = name.charAt(name.length - 1) === 's' ? `${name}' ` : `${name}'s `;
        return name + 'photo';
      }
    },
    async getNames() {
      const set = new Set();
      if (this.messages.length) {
        this.messages.map((x) => set.add(x.user));
      }
      if (this.chats.length) {
        this.chats.map((x) => {
          if (x.type === 'private') set.add(x.target);
        });
      }

      if (!set.size) return;

      let names = await User.find();

      if (names) {
        set.forEach((name) => {
          const found = names.find((x) => x._id === name);
          this.names[name] = found?.name;
        });
      }
    },
    async getImages() {
      if (this.chats.length) {
        let ids = [];
        let users = [];
        let data = [];

        for (let chat of this.chats) {
          if (chat.type === 'photo') {
            ids.push(chat.target);
          }
        }

        let images = await Upload.find({ _id: { $in: ids } });

        for (let image of images) {
          data.push({ id: image._id, url: image.url, user: image.user });
          users.push(image.user);
        }

        const set = new Set(users);
        users = Array.from(set);

        let userNames = await User.find({ _id: { $in: users } });

        for (let i = 0; i < data.length; i++) {
          const { name } = userNames.find((x) => x._id === data[i].user);
          data[i].name = name;
        }

        this.images = data;
        console.log(this.images);
      }
    },
    async joinRoom(room, type) {
      const payload = { room, type };
      this.$store.commit('setChatTarget', payload);
      let messages;
      if (type !== 'private') {
        let res = await fetch(`/api/chat/join/${this.chat.chatTarget}?id=${this.id}&type=${this.chat.chatType}`);
        res = await res.json();
        if (res.success) {
          if (this.chat.chatType === 'location' || this.chat.chatType === 'tag') {
            messages = await Message.find({
              chatTarget: this.chat.chatTarget,
              chatType: this.chat.chatType,
            });
          } else {
            messages = await Message.find({
              chatTarget: this.chat.chatTarget,
            });
          }
        }
      } else {
        // Fetch private messages between users, don't join a room
        let sent, received;
        try {
          sent = await Message.find({
            $and: [{ user: this.id }, { chatTarget: this.chat.chatTarget }],
          });
        } catch (error) {
          console.warn(error);
        }

        try {
          received = await Message.find({
            $and: [{ user: this.chat.chatTarget }, { chatTarget: this.id }],
          });
        } catch (error) {
          console.warn(error);
        }

        messages = [...sent, ...received].sort((m1, m2) => (m1.time > m2.time ? 1 : -1));
      }
      this.$store.commit('previousMessages', messages);
    },
    leaveRoom() {
      this.$store.dispatch('leaveRoom');
    },
    displayIcon(type, target) {
      if (type === 'location') {
        return '<i class="material-icons">location_on</i>';
      }
      if (type === 'tag') {
        return '<i class="material-icons">extension</i>';
      }
      if (type === 'private') {
        return '<i class="material-icons">person</i>';
      }
      if (type === 'photo') {
        if (this.images.length) {
          const { url } = this.images.find((x) => x.id === target);
          if (url) return `<img class="render" src="${url}" alt="" />`;
        }
      }
      return '';
    },
    async getChats() {
      let chats = await Message.find({ user: this.id });

      chats.forEach((chat) => {
        const found = this.chats.find((x) => x.target === chat.chatTarget);
        if (found && found.type === chat.chatType) return;
        this.chats.push({
          target: chat.chatTarget,
          type: chat.chatType,
          time: chat.time,
        });
      });

      // Look for other private chats started by another user

      let privateChats = await Message.find({ chatTarget: this.id });

      const set = new Set();
      for (let privateChat of privateChats) {
        set.add(privateChat.user);
      }

      if (set.size) {
        set.forEach((chat) => {
          const found = this.chats.find((x) => x.target === chat);
          if (found) return;
          let time = privateChats.filter((name) => name.user === chat);
          time = privateChats[time.length - 1].time;
          this.chats.push({
            target: chat,
            type: 'private',
            time: time,
          });
        });
      }

      if (!this.chats.length && this.chat.chatTarget === '') {
        this.fetchedChats = true;
      } else {
        this.fetchedChats = false;
      }

      this.getImages();
      this.getNames();
      this.updateChats();
    },
    async updateChats() {
      const messages = await Message.find({
        $or: [{ user: this.id }, { chatTarget: this.id }],
      });

      for (let message of messages) {
        let target;
        if (message.chatType === 'private') {
          if (message.user === this.id) {
            target = message.chatTarget;
          } else {
            target = message.user;
          }
        } else {
          target = message.chatTarget;
        }
        const time = message.time;
        const index = this.chats.findIndex((i) => i.target === target);
        const previousTime = this.chats[index]?.time;
        if (previousTime && previousTime < time) {
          this.chats[index].time = time;
        }
      }
      this.chats = this.chats.sort((m1, m2) => (m1.time > m2.time ? -1 : 1));
    },
    startQueryChat() {
      const id = this.$route.query.id;
      const type = this.$route.query.type;
      if (id) {
        this.$nextTick(() => {
          if (id === this.id) return; // You're not supposed to be able to chat with yourself
          this.joinRoom(id, type);
        });
      }
    },
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.getNames();
          this.timestamp = [];
          if (!this.messages.length) {
            this.getChats();
          } else {
            this.scrollDown();
          }
          if (this.chat.chatTarget === '') {
            this.scrollBehavior = 'auto';
          } else {
            this.scrollBehavior = 'smooth';
          }
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
#router {
  overflow-x: hidden;
}
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
.no-margin-padding {
  padding: 0 !important;
  margin: 0 !important;
}
section.target div.target {
  width: 100vw;
  height: 80px;
  border-bottom: 1px solid #e4e4e4;
  padding: 1rem;
}
div.target article {
  display: flex;
  align-items: center;
}
div.icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e4e4e4;
  margin-right: 1rem;
  display: grid;
  place-items: center;
  color: #fff;
}
.hide {
  display: none;
}
section.no-chats {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0 2rem;
  text-align: center;
}
section.no-chats i {
  color: #e4e4e4;
  font-size: 5rem;
}
div.icon >>> img.render {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
