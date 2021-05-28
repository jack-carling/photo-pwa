<template>
  <main>
    <Emoji v-if="showEmoji" @emoji="renderEmoji" />
    <div v-if="activeChat" class="chat">
      <input @keyup.enter="sendMessage" v-model="message" ref="message" type="text" placeholder="Aa" />
      <div><i class="material-icons" @click="toggleEmoji">emoji_emotions</i></div>
      <div><i class="material-icons" @click="sendMessage">send</i></div>
    </div>
    <div class="navigation" v-else>
      <div>
        <i class="material-icons" @click="$router.push('/')">home</i>
      </div>
      <div>
        <i class="material-icons" @click="$router.push('/search')">search</i>
      </div>
      <div>
        <i class="material-icons" @click="$router.push('/camera')">photo_camera</i>
      </div>
      <div>
        <i class="material-icons" @click="$router.push('/chat')">question_answer</i>
      </div>
      <div>
        <i class="material-icons" @click="$router.push('/account')">account_circle</i>
      </div>
    </div>
  </main>
</template>

<script>
import Emoji from './Emoji.vue';

export default {
  components: {
    Emoji,
  },
  data() {
    return {
      message: '',
      showEmoji: false,
    };
  },
  computed: {
    id() {
      return this.$store.state.user._id;
    },
    activeChat() {
      if (this.$route.path === '/chat' && this.chat.chatTarget !== '') {
        return true;
      } else {
        return false;
      }
    },
    chat() {
      return this.$store.state.chat;
    },
  },
  methods: {
    async sendMessage() {
      if (this.message.trim().length === 0) {
        this.message = '';
        return;
      }
      const message = this.message;
      this.message = '';

      let data = JSON.stringify({
        user: this.id,
        chatTarget: this.chat.chatTarget,
        message,
        chatType: this.chat.chatType,
      });
      let res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      });
      res = await res.json();
    },
    toggleEmoji() {
      this.showEmoji = !this.showEmoji;
    },
    renderEmoji(emoji) {
      this.message += emoji + ' ';
      this.$refs.message.focus();
    },
  },
  watch: {
    activeChat() {
      if (!this.activeChat) {
        this.showEmoji = false;
      }
      if (this.activeChat) {
        this.$nextTick(() => {
          this.$refs.message.focus();
        });
      }
    },
  },
};
</script>

<style scoped>
div.chat,
div.navigation {
  height: 50px;
  background-color: #00acc1;
  border-top: 1px solid #fff;
}
div.chat {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}
div.navigation {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
div.chat div,
div.navigation div {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  color: #eceff1;
  cursor: pointer;
}
input,
input:focus {
  margin: 0 !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
input {
  background-color: #eceff1 !important;
  height: initial !important;
  padding: 0.5rem 1rem !important;
  border-radius: 999px !important;
}
</style>
