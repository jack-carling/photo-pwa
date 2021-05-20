<template>
  <main>
    <section class="hero-banner">
      <img class="homepage-hero" src="..\assets\homepage-hero.png" alt="homepage-hero">
      <h1>Home</h1>
      <div class="homepage-elements">
        <img class="dark-logo" src="../assets/Apperture_dark_logo.svg" />
        <a class="waves-effect cyan darken-1 btn">Login</a>
        <a class="waves-effect cyan darken-1 btn">Create Account</a>
      </div>
      <div class="row">
        <div class="col s6 m6 14">
          <img
            class="image_1"
            src="../assets/pexels-jaime-reimer-2662086.jpg"
          />
        </div>
        <div class="col s6 m6 14">
          <img
            class="image_2"
            src="../assets/pexels-alexandr-podvalny-2070485.jpg"
          />
        </div>
        <div class="col s12 m6 14">
          <img class="image_3" src="../assets/pexels-jimmy-teoh-1010657.jpg" />
        </div>
        <div class="col s6 m6 14">
          <img class="image_4" src="../assets/pexels-david-bartus-586687.jpg" />
        </div>
        <div class="col s6 m6 14">
          <img class="image_5" src="../assets/pexels-jess-vide-4319752.jpg" />
        </div>
        <div class="col s12 m6 14">
          <img
            class="image_6"
            src="../assets/pexels-nina-uhlíková-287240.jpg"
          />
        </div>
        <div class="col s12 m6 14">
          <img class="image_6" src="../assets/pexels-esrageziyor-7472287.jpg" />
        </div>
      </div>
    </section>
  </main>
</template>
  
<script>
export default {
  computed: {
    online() {
      return this.$store.state.user.online;
    },
  },
};
</script>

<style scoped>
html {
  max-width: 100vw;
}

#router {
  margin: 0;
  padding: 0;
}

.hero-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* background-image: url("../assets/homepage_hero.svg");
  background-size: contain;
  background-repeat: no-repeat; */
}

.homepage-hero {
  position: absolute;
  left: 0px;
  top: 50px;  
  z-index: -1;
  /* background: linear-gradient(gray, white); */
}

.homepage-elements {
  margin-top: 19rem;
  height: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

img {
  width: 100%;
}

.row {
  margin-top: 10%;
}
</style>
