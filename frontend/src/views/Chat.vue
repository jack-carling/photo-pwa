<template>
  <main ref="area">
    <div v-for="(message, index) in messages" :class="{ self: checkSelf(message) }" :key="index">
      {{ message.message }}
      <span class="name" v-html="displayInfo(message)"></span>
    </div>
  </main>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('startChat');
    if (!this.online) {
      this.$router.push('/account');
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    name() {
      return this.$store.state.user.name;
    },
    online() {
      return this.$store.state.user.online;
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
      if (this.name === message.username) {
        return true;
      } else {
        return false;
      }
    },
    displayInfo(message) {
      let date = new Date(message.time);
      date = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const check = this.checkSelf(message);
      if (check) {
        return `${message.username} | ${date}`;
      } else {
        return `${date} | ${message.username}`;
      }
    },
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollDown();
        });
      },
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
}
main div {
  word-wrap: break-word;
  color: #eceff1;
  background-color: #607d8b;
  width: max-content;
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  position: relative;
  margin-bottom: 1.5rem;
}
main div.self {
  align-self: flex-end;
  background-color: #00acc1;
}
main div:last-of-type {
  margin-bottom: 0.5rem;
}
div span.name {
  font-size: 0.7rem;
  position: absolute;
  bottom: -1rem;
  left: 0.5rem;
  white-space: nowrap;
  color: initial;
}
div.self span.name {
  left: auto;
  right: 0.5rem;
}
</style>
