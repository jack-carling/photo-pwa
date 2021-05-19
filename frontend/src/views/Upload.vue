<template>
  <main>
    <img ref="image" :src="source" alt="" />
    <p class="info">
      <i class="material-icons">location_on</i>
      Where was this photo taken?
    </p>
    <section class="radio">
      <article v-if="locations.length">
        <label v-for="(location, i) in locations" :key="i">
          <input class="with-gap" v-model="pickedLocation" name="group" type="radio" :value="location" />
          <span>{{ location }}</span>
        </label>
      </article>
      <label v-if="!locations.length">
        <input class="with-gap" v-model="pickedLocation" name="group" type="radio" value="hide" />
        <span>Hide location</span>
      </label>
      <label>
        <input class="with-gap" v-model="pickedLocation" name="group" type="radio" value="pick" />
        <span>Enter manually</span>
      </label>
    </section>
    <div class="input-field location" v-if="pickManually">
      <input id="manual" type="text" autocomplete="off" v-model="inputLocation" />
      <label for="manual">Location</label>
    </div>
    <p class="info">
      <i class="material-icons">extension</i>
      Add tags:
    </p>
    <div class="input-field">
      <input id="manual" type="text" autocomplete="off" v-model="inputTags" @keyup.enter="addTag" />
      <label for="manual">Type and press enter</label>
    </div>
    <section class="tags">
      <div class="chip" v-for="(tag, i) in tags" :key="i">
        {{ tag }}
        <i class="material-icons" @click="deleteTag(i)">close</i>
      </div>
    </section>
    <button class="btn waves-effect waves-light cyan darken-1">Upload</button>
  </main>
</template>

<script>
export default {
  data() {
    return {
      pickedLocation: '',
      pickManually: false,
      inputLocation: '',
      locations: [],
      inputTags: '',
      tags: [],
    };
  },
  computed: {
    source() {
      return this.$store.state.photo.data;
    },
  },
  methods: {
    addTag() {
      const input = this.inputTags.split(' ');
      input.forEach((tag) => {
        if (!this.tags.includes(tag) && tag !== '') {
          this.tags.push(tag);
        }
      });
      this.inputTags = '';
    },
    deleteTag(index) {
      this.tags.splice(index, 1);
    },
  },
  mounted() {
    if (!this.source) {
      this.$router.push('/camera');
      return;
    }
    this.locations = this.$store.state.locations.map((location) => {
      if (location) return location;
    });
    setTimeout(() => {
      this.$refs.image.style.maxHeight = '100px';
    }, 200);
    if (!this.locations.length) {
      this.pickedLocation = 'hide';
    }
  },
  watch: {
    pickedLocation() {
      if (this.pickedLocation === 'pick') {
        this.pickManually = true;
      } else {
        this.pickManually = false;
        this.inputLocation = '';
      }
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  transition: max-height 1s linear;
}
section.radio,
section.radio article {
  display: flex;
  flex-direction: column;
}
[type='radio']:checked + span:after,
[type='radio'].with-gap:checked + span:after {
  background-color: #00acc1 !important;
}
[type='radio']:checked + span:after,
[type='radio'].with-gap:checked + span:before,
[type='radio'].with-gap:checked + span:after {
  border: 2px solid #00acc1;
}
p.info {
  display: flex;
  align-items: center;
  color: #607d8b;
}
p.info i {
  margin-right: 0.5rem;
}

div.input-field {
  margin-top: 2rem;
}
button {
  margin-top: 1rem;
}
section.tags i {
  cursor: pointer;
  float: right;
  font-size: 16px;
  line-height: 32px;
  padding-left: 8px;
}
</style>
