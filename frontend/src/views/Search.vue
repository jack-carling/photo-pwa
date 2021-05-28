<template>
  <main>
    <section class="search">
      <div>
        <div class="search">
          <input type="text" autocomplete="off" v-model="input" @keyup.enter="search" placeholder="Search..." />
          <i v-if="input.length" @click="clearInput" class="material-icons">cancel</i>
        </div>
        <div class="icon" @click="search">
          <i class="material-icons">search</i>
        </div>
      </div>
    </section>

    <ul>
      <li v-if="resultText">
        <div class="icon">
          <i class="material-icons">search</i>
        </div>
        {{ resultText }}
      </li>
      <li v-for="(result, i) in results" :key="i" @click="handleResult(result)">
        <div class="icon" v-html="displayIcon(result)"></div>
        <span>{{ result.name }}</span>
      </li>
    </ul>

    <Render :images="images" v-show="images.length" />

    <section v-if="!results.length && !resultText" class="no-results">
      <div>
        <i class="material-icons">search</i>
        <p>Use the search bar at the top to find users, tags or locations!</p>
      </div>
    </section>
  </main>
</template>

<script>
import Render from '../components/Render.vue';

import mongoosy from 'mongoosy/frontend';

const { User, Upload } = mongoosy;

export default {
  components: {
    Render,
  },
  data() {
    return {
      input: '',
      results: [],
      resultText: '',
      images: [],
    };
  },
  computed: {
    name() {
      return this.$store.state.user.name;
    },
  },
  mounted() {
    const query = this.$route.query?.q;
    if (query) {
      this.input = query;
      this.search();
    }
  },
  methods: {
    clearInput() {
      this.input = '';
    },
    displayIcon(result) {
      if (result.type === 'location') {
        return '<i class="material-icons">location_on</i>';
      }
      if (result.type === 'tag') {
        return '<i class="material-icons">extension</i>';
      }
      return '<i class="material-icons">person</i>';
    },
    async search() {
      const input = this.input;
      this.images = [];

      if (input.length < 2) {
        this.results = [];
        this.resultText = 'Please enter at least 2 characters';
        return;
      }
      const q = new RegExp(input, 'i');
      const users = await User.find({ name: q });
      const uploads = await Upload.find({
        $or: [{ tags: q }, { location: q }],
      });
      let results = [];
      results = [...users];
      results = results.filter((x) => x.name !== this.name); // You can't search for yourself

      for (let i = 0; i < uploads.length; i++) {
        if (q.test(uploads[i].location)) {
          // You cannot find pictures that has hidden their location by searching for hide
          if (uploads[i].location === 'hide') break;
          const found = results.find((x) => {
            return x.name === uploads[i].location.toLowerCase();
          });
          if (found) break;
          results.push({
            name: uploads[i].location.toLowerCase(),
            type: 'location',
          });
        }

        for (let j = 0; j < uploads[i].tags.length; j++) {
          if (q.test(uploads[i].tags[j])) {
            const found = results.find((x) => {
              return x.name === uploads[i].tags[j].toLowerCase();
            });
            if (found) break;
            results.push({
              name: uploads[i].tags[j].toLowerCase(),
              type: 'tag',
            });
          }
        }
      }

      for (let i = 0; i < results.length; i++) {
        if (results[i].hasOwnProperty('name')) {
          const lengthOfWord = results[i].name.length;
          const numberOfMatches = lengthOfWord - results[i].name.split(q).join('').length;
          const accuracy = numberOfMatches / lengthOfWord;
          results[i].accuracy = Number(accuracy.toFixed(2));
        }
      }
      this.results = results.sort((r1, r2) => (r1.accuracy > r2.accuracy ? -1 : 1));

      if (results.length === 0) {
        this.resultText = 'No results';
      } else if (results.length === 1) {
        this.resultText = results.length + ' result';
      } else {
        this.resultText = results.length + ' results';
      }
    },
    handleResult(result) {
      if (result.type !== 'tag' && result.type !== 'location') {
        const id = result._id;
        this.$router.push(`/chat?id=${id}&type=private`);
      } else if (result.type === 'tag') {
        this.searchImages(result.name, result.type);
      } else {
        this.searchImages(result.name, result.type);
      }
    },
    async searchImages(name, type) {
      const re = new RegExp(name, 'i');
      let images;
      if (type === 'tag') {
        images = await Upload.find({ tags: re });
      } else {
        images = await Upload.find({ location: re });
      }
      this.images = images;
      this.results = [];
      if (images.length === 1) {
        this.resultText = images.length + ' result';
      } else {
        this.resultText = images.length + ' results';
      }
      this.input = name;
    },
  },
};
</script>

<style scoped>
#router {
  padding: 0;
}
section.search {
  background-color: #00acc1;
}
section.search div {
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 0.5rem;
  position: relative;
}
div.search i {
  position: absolute;
  right: 1rem;
  color: #bbb;
}
input,
input:focus {
  margin: 0 !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
input {
  background-color: #eceff1 !important;
  height: initial !important;
  padding: 0.5rem 1rem !important;
  padding-right: 2.5rem !important;
  border-radius: 999px !important;
}
section div.icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  color: #eceff1;
  cursor: pointer;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  padding: 0.5em;
  border-bottom: 1px solid #eceff1;
  display: flex;
  align-items: center;
  width: 100%;
}
li span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
li div.icon {
  margin-right: 1rem;
  color: #ccc;
  display: flex;
  align-items: center;
}
section.no-results {
  width: 100%;
  height: calc(100% - 50px);
  display: grid;
  place-items: center;
  padding: 0 2rem;
  text-align: center;
}
section.no-results i {
  color: #e4e4e4;
  font-size: 5rem;
}
</style>
