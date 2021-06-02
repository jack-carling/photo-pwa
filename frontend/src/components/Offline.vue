<template>
  <div v-if="!online">You're offline</div>
</template>

<script>
export default {
  data() {
    return {
      online: true,
    };
  },
  created() {
    window.addEventListener('online', () => {
      this.online = navigator.onLine;
    });
    window.addEventListener('offline', () => {
      this.online = navigator.onLine;
    });
  },
};
</script>

<style scoped>
div {
  position: absolute;
  bottom: calc(50px + 1rem);
  background-color: #ff7043;
  color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 999px;
  width: 50vw;
  text-align: center;
  padding: 0.2rem;
  margin: 0 auto;
  left: 0;
  right: 0;
}
</style>
