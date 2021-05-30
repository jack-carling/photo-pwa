<template>
  <main ref="main">
    <section v-if="!online" class="hero-banner">
      <div class="search">
        <input
          type="text"
          @keyup.enter="search"
          v-model="input"
          autocomplete="off"
          placeholder="Search for tags, locations and people"
        />
        <i class="material-icons" @click="search">search</i>
      </div>
      <div class="homepage-elements">
        <img src="../assets/logo_dark.svg" />
        <a class="waves-effect waves-light cyan darken-1 btn" @click="$router.push('/account')">Login</a>
        <a class="waves-effect waves-light cyan darken-1 btn" @click="$router.push('/account?redirect=signup')"
          >Sign up</a
        >
      </div>
    </section>

    <section class="feed animate__animated" :class="{ animate__slideInUp: !online && !scrollPosition }" ref="feed">
      <div
        class="images animate__animated animate__fadeIn animate__slow"
        v-for="(upload, i) in uploads"
        v-bind:key="i"
        @click="handleImage(upload)"
      >
        <img @load="resizeImages" :src="upload.url" class="render" />
        <div class="chip animate__animated animate__fadeIn animate__slow">
          <span>{{ displayName(upload.user) }}</span>
          <i class="material-icons">person</i>
        </div>
      </div>
    </section>
    <footer ref="footer">
      <div v-if="!fetchedAll">
        <img
          class="animate__animated animate__fadeIn animate__slow"
          v-show="loading"
          src="../assets/loader.gif"
          alt=""
        />
      </div>
      <div class="footer-message" v-else>
        <i class="material-icons">check_circle</i>
        <span>You're up to date!</span>
      </div>
    </footer>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { Upload, User } = mongoosy;

export default {
  data() {
    return {
      names: [],
      input: '',
      maxLoad: 8,
      fetchedAll: false,
      observer: null,
      loading: false,
    };
  },
  created() {
    window.addEventListener('resize', this.resizeImages);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeImages);
    if (this.observer) {
      this.observer.disconnect();
    }
    this.$store.commit('scrollPosition', this.$refs.main.scrollTop);
  },
  computed: {
    online() {
      return this.$store.state.user.online;
    },
    uploads() {
      return this.$store.state.uploads;
    },
    upload() {
      return this.$store.state.upload;
    },
    scrollPosition() {
      return this.$store.state.scrollPosition;
    },
  },
  async mounted() {
    const count = await Upload.countDocuments();
    this.$store.commit('setUploadCount', count);
    this.getNewData();

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.loading = true;
        this.getData();
      }
    });

    this.observer.observe(this.$refs.footer);

    if (!this.names.length) this.getNames();

    this.$nextTick(() => {
      this.$refs.main.scrollBy({ top: this.scrollPosition });
    });
  },
  methods: {
    async getData() {
      const total = this.uploads.length + this.upload.offset;
      if (total >= this.upload.total) {
        this.fetchedAll = true;
        return;
      }

      const even = this.uploads.length % 2 === 0 ? true : false;

      let numberToFetch;
      if (even) {
        numberToFetch = this.maxLoad;
      } else {
        numberToFetch = this.maxLoad + 1;
      }

      const numbersToSkip = this.maxLoad * (this.upload.page - 1) + this.upload.offset;
      const uploads = await Upload.find().sort({ time: -1 }).skip(numbersToSkip).limit(numberToFetch);

      this.$store.commit('saveUploads', uploads);

      this.getNames();
      this.$store.commit('increasePage');
      this.loading = false;
    },
    async getNewData() {
      const offset = this.upload.offset;
      const newUploads = this.upload.new;
      if (!offset) return;

      if (newUploads > offset) return;
      const numberOfNew = offset - newUploads;

      const numbersToSkip = numberOfNew - offset;
      const uploads = await Upload.find().sort({ time: -1 }).skip(numbersToSkip).limit(numberOfNew);
      this.$store.commit('saveNewUploads', uploads);
      this.$store.commit('setNewUploads', numberOfNew);
    },
    search() {
      const search = `/search?q=${this.input}`;
      this.$router.push(search);
    },
    handleImage(image) {
      this.$store.commit('setResultImage', image);
      this.$router.push('/result');
    },
    resizeImages() {
      this.$nextTick(() => {
        const img = document.querySelector('.render');
        const size = img.offsetWidth + 'px';
        this.$refs.feed.style.setProperty('grid-auto-rows', size);
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
        const name = names.find((name) => name._id === user);

        const found = this.names.find((x) => x.user === user);
        if (found) continue;

        this.names.push({ name: name?.name, user });
      }
    },
    displayName(target) {
      let name = this.names.find((x) => x.user === target);
      if (name?.name) {
        return name.name;
      } else {
        return '';
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
section.hero-banner {
  height: 90%;
  width: 100vw;
  position: relative;
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 20%),
    url('../assets/background.png') no-repeat center center;
  background-size: cover;
}
div.homepage-elements {
  position: absolute;
  width: 100%;
  bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  width: 150px;
  margin-top: 0.8rem;
}
div.search {
  display: flex;
  align-items: center;
  width: calc(100% - 2rem);
  top: 2rem;
  left: 1rem;
  position: absolute;
  background-color: #00acc1 !important;
  border-radius: 5px !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
}
div.search i {
  margin-right: 1rem;
  color: #eceff1;
}
input,
input:focus {
  margin: 0 !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
input {
  background-color: transparent !important;
  color: #eceff1;
  width: 100% !important;
  height: initial !important;
  padding: 1rem 0.5rem 1rem 1rem !important;
}
footer {
  height: 50px;
  display: grid;
  place-items: center;
}
footer img {
  height: 25px;
}
div.footer-message {
  display: flex;
  align-items: center;
}
div.footer-message i {
  color: #ccc;
  margin-right: 0.5rem;
  font-size: 16px;
}
</style>
