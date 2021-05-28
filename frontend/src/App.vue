<template>
  <main class="app">
    <NavigationTop />
    <router-view id="router"></router-view>
    <NavigationBottom />
  </main>
</template>

<script>
import NavigationTop from './components/NavigationTop.vue';
import NavigationBottom from './components/NavigationBottom.vue';

export default {
  components: {
    NavigationTop,
    NavigationBottom,
  },
  async created() {
    this.$store.dispatch('check');
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#router {
  max-height: 100%;
  margin: 0;
  padding: 1rem;
  overflow: auto;
}
main.app {
  display: grid;
  grid-template-rows: min-content auto min-content;
  height: 100vh;
}
.input-field input {
  line-height: 0;
}
.input-field input[type='text']:focus,
.input-field input[type='email']:focus,
.input-field input[type='password']:focus {
  border-bottom: 1px solid #00acc1 !important;
  box-shadow: 0 1px 0 0 #00acc1 !important;
}
div.chip {
  display: inline-flex;
  max-width: 50vw;
  white-space: nowrap;
  text-overflow: ellipsis;
}
div.chip span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
div.chip i {
  flex: 1;
}
</style>
