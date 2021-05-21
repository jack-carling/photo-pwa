<template>
  <div class="main cyan darken-1">
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
  },
  methods: {
    async leaveRoom() {
      let res = await fetch(`/api/chat/leave/${this.chatTarget}?id=${this.id}`);
      res = await res.json();
      this.$store.commit('setChatTarget', false);
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
