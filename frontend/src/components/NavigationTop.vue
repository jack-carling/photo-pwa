<template>
  <div class="main cyan darken-1" :class="{ border: chat }">
    <div v-if="chat" @click="leaveRoom">
      <i class="material-icons">arrow_back</i>
    </div>
    <div v-else></div>
    <img @click="$router.push('/')" src="../assets/Apperture_white_logo.svg" alt="" />
  </div>
</template>

<script>
export default {
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
};
</script>

<style scoped>
div.main {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.border {
  border-bottom: 1px solid #fff;
}
div.main div {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
}
i {
  font-size: 2.5rem;
  color: #eceff1;
  cursor: pointer;
}
img {
  margin-right: 0.5rem;
  justify-self: end;
}
</style>
