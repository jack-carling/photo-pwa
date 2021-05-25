<template>
  <div class="main-container">
    <section v-show="!online" class="hero-banner">
      <img
        class="homepage-hero"
        src="../assets/homepage-hero-gradient.png"
        alt="homepage-hero"
      />
      <form>
        <div class="input-field">
          <input
            id="search"
            type="search"
            required
            placeholder="Search for tags, locations and people"
          />
          <label class="label-icon" for="search"
            ><i class="material-icons" @click="$router.push('/search')"
              >search</i
            ></label
          >
        </div>
      </form>
      <div class="homepage-elements">
        <img class="dark-logo" src="../assets/Apperture_dark_logo.svg" />
        <a
          class="waves-effect waves-light cyan darken-1 btn"
          @click="$router.push('/account')"
          >Login</a
        >
        <a
          class="waves-effect waves-light cyan darken-1 btn"
          @click="$router.push('/account?redirect=signup')"
          >Sign up</a
        >
      </div>
      <!-- 
      <div class="container" style="overflow: hidden">
        <div class="row">
          <div class="col s6 m6 14">
            <img
              class="image_1"
              src="../assets/pexels-jaime-reimer-2662086.jpg"
            />
          </div>
          <div class="col s6 m6 14" style="overflow: hidden">
            <img
              class="image_2"
              src="../assets/pexels-alexandr-podvalny-2070485.jpg"
            />
          </div>
          <div class="col s12 m6 14">
            <img
              class="image_3"
              src="../assets/pexels-jimmy-teoh-1010657.jpg"
            />
          </div>
          <div class="col s6 m6 14">
            <img
              class="image_4"
              src="../assets/pexels-david-bartus-586687.jpg"
            />
          </div>
          <div class="col s6 m6 14">
            <img class="image_5" src="../assets/pexels-belle-co-345750.jpg" />
          </div>
          <div class="col s12 m6 14">
            <img
              class="image_6"
              src="../assets/pexels-nina-uhlíková-287240.jpg"
            />
          </div>
          <div class="col s12 m6 14">
            <img
              class="image_6"
              src="../assets/pexels-esrageziyor-7472287.jpg"
            />
          </div>
        </div>
      </div>
       -->
    </section>
    <section class="images">
      <img
        :src="upload.url"
        v-for="(upload, index) in uploads"
        v-bind:key="index"
      />
    </section>
  </div>
</template>
  
<script>
import mongoosy from "mongoosy/frontend";
const { Upload } = mongoosy;

export default {
  data() {
    return {
      uploads: [],
    };
  },
  computed: {
    online() {
      return this.$store.state.user.online;
    },
  },
  async mounted() {
    const uploads = await Upload.find();
    this.uploads = uploads;
  },
  created() {
    if (this.online) {

    }
  }
};
</script>



<style scoped>
* {
  overflow: hidden;
  box-sizing: border-box;
}

#router {
  margin: 0;
  padding: 0;
}

section.images {
  position: relative;
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  max-width: 100%;
  gap: 1%;
  object-fit: cover;
}

.dark-logo {
  max-width: 140%;
  margin-bottom: 2px;
}

.hero-banner {
  position: sticky;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.4rem;
}

.homepage-hero {
  position: absolute;
  left: -1.3rem;
  top: 0px;
  z-index: -1;
  overflow: hidden;
  width: 110%;
}

form {
  width: 90%;
}

.input-field {
  position: relative;
}

.input-field > label {
  color: #ffffff;
  font-size: 1rem;
  cursor: text;
  text-align: center;
}

#search {
  padding-left: 0.7rem;
  width: 95%;
  background: #00acc1;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
}

.label-icon {
  margin-left: 87%;
  margin-top: 0.8rem;
}

.homepage-elements {
  margin-top: 95%;
  height: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

img {
  width: 100%;
  object-fit: fill;
}

.row {
  margin-top: 10%;
}

.btn {
  width: 150px;
  height: 60px;
  margin-top: 0.8rem;
}
</style>
