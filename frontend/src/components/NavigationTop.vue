<template>
  <div class="main cyan darken-1" :class="{ border: !search }">
    <div class="nav">
      <div class="back" v-if="chat" @click="leaveRoom">
        <i class="material-icons">arrow_back</i>
      </div>
      <div class="back" v-else></div>
      <img @click="$router.push('/')" src="../assets/logo_white.svg" alt="" />
    </div>
    <div v-if="chat" class="chat-info-wrapper">
      <div class="chat-info animate__animated animate__fadeIn animate__slower">
        <i class="material-icons">{{ displayIcon }}</i>
        <span>{{ displayText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayIcon: '',
      displayText: '',
    };
  },
  computed: {
    chat() {
      if (this.$route.path === '/chat' && this.chatTarget !== '') {
        return true;
      } else {
        return false;
      }
    },
    chatTarget() {
      return this.$store.state.chat.chatTarget;
    },
    chatType() {
      return this.$store.state.chat.chatType;
    },
    chatName() {
      return this.$store.state.chatName;
    },
    search() {
      if (this.$route.path === '/search') {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    async leaveRoom() {
      if (this.chatType === 'private') {
        this.$store.commit('setChatTarget', false);
      } else {
        this.$store.dispatch('leaveRoom');
      }
    },
  },
  watch: {
    chatType() {
      if (this.chatType === 'location') {
        this.displayIcon = 'location_on';
      } else if (this.chatType === 'tag') {
        this.displayIcon = 'extension';
      } else if (this.chatType === 'private') {
        this.displayIcon = 'person';
      } else if (this.chatType === 'photo') {
        this.displayIcon = 'photo';
      }
    },
    chatName() {
      this.displayText = this.chatName;
    },
  },
};
</script>

<style scoped>
div.main {
  min-height: 50px;
}
div.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.border {
  border-bottom: 2px solid #fff;
}
div.back {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
}
div.chat-info-wrapper {
  display: flex;
  justify-content: center;
  height: 30px;
  width: 100%;
}
div.chat-info {
  color: #eceff1;
  font-size: smaller;
  display: grid;
  align-items: center;
  max-width: 100%;
  grid-template-columns: min-content auto;
  overflow: hidden;
}
div.chat-info span {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
div.chat-info i {
  font-size: 14px;
  margin-right: 0.3rem;
}
div.back i {
  font-size: 2.5rem;
  color: #eceff1;
  cursor: pointer;
}
img {
  margin-right: 0.5rem;
  justify-self: end;
}
</style>
