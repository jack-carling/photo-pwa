<template>
  <main ref="main">
    <img v-for="(image, i) in images" :key="i" :src="image.url" alt="" class="render" @click="handleImage(image)" />
  </main>
</template>

<script>
export default {
  props: {
    images: Array,
  },
  computed: {
    imagesRendered() {
      return this.images.length;
    },
  },
  created() {
    window.addEventListener('resize', this.resizeImages);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeImages);
  },
  methods: {
    resizeImages() {
      this.$nextTick(() => {
        const img = document.querySelector('.render');
        const size = img.offsetWidth + 'px';
        this.$refs.main.style.setProperty('grid-auto-rows', size);
      });
    },
    handleImage(image) {
      this.$store.commit('setResultImage', image);
      this.$router.push('/result');
    },
  },
  watch: {
    imagesRendered() {
      if (this.imagesRendered) {
        this.resizeImages();
      }
    },
  },
};
</script>

<style scoped>
main {
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 2px;
  gap: 2px;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
