<template>
  <main>
    <section v-if="!online" class="hero-banner">
      <img class="homepage-hero" src="../assets/homepage-hero-gradient.png" alt="homepage-hero" />
      <form>
        <div class="input-field">
          <input id="search" type="search" required placeholder="Search for tags, locations and people" />
          <label class="label-icon" for="search"
            ><i class="material-icons" @click="$router.push('/search')">search</i></label
          >
        </div>
      </form>
      <div class="homepage-elements">
        <img class="dark-logo" src="../assets/Apperture_dark_logo.svg" />
        <a class="waves-effect waves-light cyan darken-1 btn" @click="$router.push('/account')">Login</a>
        <a class="waves-effect waves-light cyan darken-1 btn" @click="$router.push('/account?redirect=signup')"
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

    <section class="feed" ref="feed">
      <div class="images" v-for="(upload, i) in uploads" v-bind:key="i" @click="handleImage(upload)">
        <img :src="upload.url" class="render" />
        <div class="chip">
          <span>{{ displayName(upload.user) }}</span>
          <i class="material-icons">person</i>
        </div>
        <!-- <div class="info">
          <span>sara</span>
          <i class="material-icons">question_answer</i>
        </div> -->
        <!-- <p class="user-name" @click="$router.push('/account')">
          {{ profile.name }}
        </p>
        <div class="chat-bubble" @click="$router.push('/chat')">
          <i class="tiny material-icons">question_answer</i>
        </div> -->
      </div>
    </section>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { Upload, User } = mongoosy;

export default {
  data() {
    return {
      uploads: [],
      names: [],
    };
  },
  created() {
    window.addEventListener('resize', this.resizeImages);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeImages);
  },
  computed: {
    online() {
      return this.$store.state.user.online;
    },
    uploadsRendered() {
      return this.uploads.length;
    },
  },
  async mounted() {
    const uploads = await Upload.find();
    this.uploads = uploads.reverse();
  },
  methods: {
    handleImage(image) {
      this.$store.commit('setResultImage', image);
      this.$router.push('/result');
    },
    resizeImages() {
      this.$nextTick(() => {
        const img = document.querySelector('.render');
        if (img) {
          const size = img.offsetWidth + 'px';
          this.$refs.feed.style.setProperty('grid-auto-rows', size);
        }
      });
    },
    async getNames() {
      let users = [];
      for (let upload of this.uploads) {
        users.push(upload.user);
      }

      const set = new Set(users);
      users = Array.from(set);

      let names = await User.find({ _id: { $in: users } });

      for (let i = 0; i < this.uploads.length; i++) {
        const user = this.uploads[i].user;
        const { name } = names.find((name) => name._id === user);

        const found = this.names.find((x) => x.user === user);
        if (found) continue;

        this.names.push({ name, user });
      }
    },
    displayName(target) {
      if (this.names.length) {
        let { name } = this.names.find((x) => x.user === target);
        return name;
      }
    },
  },
  watch: {
    uploadsRendered() {
      if (this.uploadsRendered) {
        this.resizeImages();
        this.getNames();
      }
    },
  },
};
</script>

<style scoped>
#router {
  margin: 0;
  padding: 0;
}
section.feed {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  padding: 2px;
}
div.images {
  position: relative;
}
div.images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
div.images div.chip {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  max-width: 33vw;
}
div.chip i {
  cursor: pointer;
  float: right;
  font-size: 16px;
  line-height: 32px;
  padding-left: 8px;
}

/* div.images div {
  height: 35px;
  background-color: #bbdefb;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
div.images i {
  color: #607d8b;
  font-size: 16px;
} */

/* Previous */

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

/* .user-name {
  display: flex;
  flex-direction: row;
  align-self: center;
  position: absolute;
  z-index: 99;
  align-items: center;
  top: 86%;
  width: 100.5%;
  height: 16%;
  background: #bbdefb;
  padding: 6%;
  font-size: 0.6rem;
  font-weight: 700;
  text-align: center;
  border: 2px solid #bbdefb;
  color: #607d8b;
} */

/* .chat-bubble {
  align-self: center;
  position: absolute;
  z-index: 99;
  left: 80%;
  bottom: -6%;
  padding: 0.5%;
  color: #607d8b;
} */

.row {
  margin-top: 10%;
}

.btn {
  width: 150px;
  height: 60px;
  margin-top: 0.8rem;
}
</style>
