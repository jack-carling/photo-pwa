<template>
  <main>
    <h1>Home</h1>
    <span>{{ name }}</span>
  </main>
</template>

<script>
export default {
  computed: {
    name() {
      if (!this.$store.state.user.online) {
        return 'Welcome to Appenture!';
      } else {
        const name = this.$store.state.user.name;
        return `Welcome back ${name}!`;
      }
    },
  },
};
</script>

<style scoped></style>
