<template>
  <main ref="area">
    <div ref="icontainer" class="image-container">
      <img ref="image" :src="source" alt="" />
    </div>
    <p class="info">
      <i class="material-icons">location_on</i>
      Where was this photo taken?
    </p>
    <section class="radio">
      <article v-if="locations.length">
        <label v-for="(location, i) in locations" :key="i">
          <input
            class="with-gap"
            v-model="pickedLocation"
            name="group"
            type="radio"
            :value="location"
            :disabled="pending"
          />
          <span>{{ location }}</span>
        </label>
      </article>
      <label>
        <input class="with-gap" v-model="pickedLocation" name="group" type="radio" value="hide" :disabled="pending" />
        <span>Hide location</span>
      </label>
      <label>
        <input class="with-gap" v-model="pickedLocation" name="group" type="radio" value="pick" :disabled="pending" />
        <span>Enter manually</span>
      </label>
    </section>
    <div class="input-field location" v-if="pickManually">
      <input id="manual" type="text" autocomplete="off" v-model="inputLocation" :disabled="pending" />
      <label for="manual">Location</label>
    </div>
    <p class="info">
      <i class="material-icons">extension</i>
      Add tags (optional)
    </p>
    <div class="input-field">
      <input id="manual" type="text" autocomplete="off" v-model="inputTags" @keyup.enter="addTag" :disabled="pending" />
      <label for="manual">Type and press enter</label>
    </div>
    <section class="tags">
      <div class="chip" v-for="(tag, i) in tags" :key="i">
        {{ tag }}
        <i class="material-icons" @click="deleteTag(i)">close</i>
      </div>
    </section>
    <p class="error" v-if="error">
      <i class="material-icons">error</i>
      {{ error }}
    </p>
    <button class="btn waves-effect waves-light cyan darken-1" @click="upload" :disabled="pending">Upload</button>
    <button class="btn waves-effect waves-light cyan darken-1 camera" v-if="uploaded" @click="$router.push('/camera')">
      <i class="material-icons left">photo_camera</i>
      Back
    </button>
    <template v-if="pending">
      <div class="progress cyan darken-1" v-if="!uploaded">
        <div class="indeterminate blue-grey"></div>
      </div>
      <p class="info" v-else>
        <i class="material-icons">check</i>
        Photo successfully uploaded!
      </p>
    </template>
  </main>
</template>

<script>
import { dataURItoBlob } from '../services/blob.js';
import { scale } from '../services/scale.js';

import mongoosy from 'mongoosy/frontend';
const { Upload } = mongoosy;

export default {
  data() {
    return {
      pickedLocation: '',
      pickManually: false,
      inputLocation: '',
      locations: [],
      inputTags: '',
      tags: [],
      error: '',
      pending: false,
      uploaded: false,
    };
  },
  computed: {
    source() {
      return this.$store.state.photo.data;
    },
    size() {
      return this.$store.state.size;
    },
    _id() {
      return this.$store.state.user._id;
    },
  },
  methods: {
    addTag() {
      let input = this.inputTags.toLowerCase();
      input = input.split(' ');
      input.forEach((tag) => {
        if (!this.tags.includes(tag) && tag !== '') {
          this.tags.push(tag);
        }
      });
      this.inputTags = '';
    },
    deleteTag(index) {
      if (this.pending) return;
      this.tags.splice(index, 1);
    },
    async upload() {
      if ((this.pickManually && this.inputLocation === '') || (!this.pickManually && !this.pickedLocation)) {
        this.error = 'Please enter a location.';
        return;
      }

      this.addTag();

      this.pending = true;

      let file = this.$store.state.photo.data;

      const [maxWidth, maxHeight] = [1000, 1000];
      const quality = 0.8;
      file = await scale(file, maxWidth, maxHeight, quality);
      file = dataURItoBlob(file);

      const data = new FormData();
      data.append('file', file, 'file.jpg');

      let res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      res = await res.json();

      if (res.success) {
        const url = `/uploads/${res.path}`;
        const location = this.pickManually ? this.inputLocation : this.pickedLocation;
        const time = Date.now();

        let upload = new Upload({
          user: this._id,
          url: url,
          location: location,
          tags: this.tags,
          time: time,
        });
        let uploaded = await upload.save();
        this.uploaded = true;
        this.$nextTick(() => {
          this.scrollDown();
        });
      } else {
        this.pending = false;
      }
    },
    scrollDown() {
      this.$refs.area.scrollTo({
        top: this.$refs.area.scrollHeight,
        behavior: 'smooth',
      });
    },
  },
  mounted() {
    if (!this.source) {
      this.$router.push('/camera');
      return;
    }

    this.$refs.image.style.maxHeight = this.size;
    this.$refs.image.style.maxWidth = this.size;
    this.$refs.icontainer.style.maxHeight = this.size;
    this.$refs.icontainer.style.minHeight = this.size;
    this.$refs.icontainer.style.maxWidth = this.size;

    this.locations = this.$store.state.locations.map((location) => {
      if (location) return location;
    });

    setTimeout(() => {
      this.$refs.image.style.maxHeight = '100px';
      this.$refs.image.style.maxWidth = '100px';
      this.$refs.icontainer.style.maxHeight = '100px';
      this.$refs.icontainer.style.minHeight = '100px';
      this.$refs.icontainer.style.maxWidth = '100px';
    }, 200);
    if (!this.locations.length) {
      this.pickedLocation = 'hide';
    }
  },
  beforeUnmount() {
    if (this.uploaded) {
      this.$store.commit('savePhoto', false);
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
div.image-container {
  transition: all 1s linear;
  display: grid;
  place-items: center;
  background-color: #eee;
}
img {
  transition: all 1s linear;
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
p.info,
p.error {
  display: flex;
  align-items: center;
  color: #607d8b;
}
p.info i,
p.error i {
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
button.camera {
  margin-left: 1rem;
}
</style>
