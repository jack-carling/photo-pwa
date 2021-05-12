<template>
<main>
  <NavigationTop />
    <router-view></router-view>
  <NavigationBottom />
</main>
</template>

<script>
import NavigationTop from './components/NavigationTop.vue'
import NavigationBottom from './components/NavigationBottom.vue'

export default {
  components: {
    NavigationTop,
    NavigationBottom
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
