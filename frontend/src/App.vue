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
};
</script>

<style>
* {
  box-sizing: border-box;
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
</style>
