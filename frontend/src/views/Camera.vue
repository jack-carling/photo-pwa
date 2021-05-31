<template>
  <main>
    <div v-show="!captured" ref="vcontainer">
      <video autoplay ref="video"></video>
    </div>
    <div v-show="captured" class="canvas" ref="container">
      <canvas v-show="!photoFromStore.isSaved" ref="canvas"></canvas>
      <img v-show="photoFromStore.isSaved" :src="photoFromStore.data" alt="" ref="image" />
    </div>
    <div class="controls" v-if="!captured">
      <div class="button">
        <label>
          <input @change="displayImage" ref="input" type="file" accept="image/*" />
          <i class="material-icons">upload</i>
        </label>
      </div>
      <div class="shutter animate__animated animate__bounceIn" @click="takePhoto"></div>
      <div class="button" @click="toggleFacingMode">
        <i class="material-icons">loop</i>
      </div>
    </div>
    <div class="controls" v-else>
      <div class="button" @click="toggleGeo">
        <template v-if="geoPending">
          <Preloader />
        </template>
        <template v-else>
          <i v-if="geoSupported" class="material-icons">location_on</i>
          <i v-else class="material-icons">location_off</i>
        </template>
      </div>
      <div class="button" @click="confirmUpload">
        <i class="material-icons">done</i>
      </div>
      <div class="button" @click="clearPhoto">
        <i class="material-icons">clear</i>
      </div>
    </div>
  </main>
</template>

<script>
import Preloader from '../components/Preloader.vue';

export default {
  components: {
    Preloader,
  },
  async mounted() {
    this.setAspectRatio();
    if (this.photoFromStore.isSaved) {
      this.captured = true;
      this.checkImageSize();
      this.getLocation();
    }
    const constraints = { video: { facingMode: this.facingMode } };
    if (navigator.mediaDevices) {
      return navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        const media = this.$refs.video;
        if ('srcObject' in media) {
          media.srcObject = stream;
        } else if (navigator.mozGetUserMedia) {
          media.mozSrcObject = stream;
        } else {
          media.src = (window.URL || window.webkitURL).createObjectURL(stream);
        }
        this.track = stream.getTracks()[0];
      });
    }
    if (
      !navigator.mediaDevices &&
      !navigator.getUserMedia &&
      !navigator.webkitGetUserMedia &&
      !navigator.mozGetUserMedia &&
      !navigator.msGetUserMedia
    ) {
      alert('User Media API not supported.');
      return;
    }
  },
  beforeUnmount() {
    if (this.track.stop) {
      this.track.stop();
    }
    if (this.photo) {
      this.$store.commit('savePhoto', this.photo);
      this.$store.commit('saveSize', this.size);
    } else if (!this.captured) {
      this.$store.commit('savePhoto', false);
    }
  },
  data() {
    return {
      captured: false,
      photo: '',
      facingMode: 'user',
      geoSupported: false,
      geoPending: true,
      track: {},
    };
  },
  computed: {
    size() {
      return this.$refs.vcontainer.clientWidth + 'px';
    },
    photoFromStore() {
      return this.$store.state.photo;
    },
    online() {
      return this.$store.state.user.online;
    },
  },
  methods: {
    setAspectRatio() {
      this.$refs.video.style.height = this.size;
      this.$refs.container.style.height = this.size;
      this.$refs.vcontainer.style.height = this.size;
    },
    takePhoto() {
      this.$store.commit('savePhoto', false);

      const canvas = this.$refs.canvas;
      const media = this.$refs.video;
      const mWidth = media.videoWidth;
      const mHeight = media.videoHeight;

      const size = Math.min(mWidth, mHeight);

      canvas.width = size;
      canvas.height = size;

      let context = canvas.getContext('2d');
      let sx, sy;

      if (mWidth > mHeight) {
        sx = -mWidth + (mWidth - mHeight) / 2;
        sy = 0;
      } else if (mWidth < mHeight) {
        sx = 0;
        sy = -mHeight + (mHeight - mWidth) / 2;
      } else {
        sx = 0;
        sy = 0;
      }

      context.scale(-1, 1);
      context.drawImage(media, sx, sy, mWidth, mHeight);
      this.photo = canvas.toDataURL();
      this.captured = true;
      this.getLocation();
    },
    toggleFacingMode() {
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    },
    confirmUpload() {
      if (!this.online) {
        this.$router.push('/account?redirect=camera');
      } else {
        if (this.geoPending) {
          this.$store.commit('saveLocations', false);
        }
        this.$router.push('/upload');
      }
    },
    toggleGeo() {
      if (this.geoPending) return;

      if (this.geoSupported) {
        this.geoSupported = false;
        this.$store.commit('saveLocations', false);
      } else {
        this.getLocation();
      }
    },
    getLocation() {
      this.geoPending = true;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (location) => {
            this.geoSupported = true;
            const geoLoc = { lat: location.coords.latitude, lng: location.coords.longitude };
            let res = await fetch(`https://geocode.xyz/${geoLoc.lat},${geoLoc.lng}?json=1`);
            res = await res.json();
            if (res?.success === false) {
              this.geoSupported = false;
            } else {
              const city = res.city ?? '';
              const region = res.region ?? '';
              const country = res.country ?? '';
              const locations = [];
              locations.push(city, region, country);
              this.$store.commit('saveLocations', locations);
            }
            this.geoPending = false;
          },
          (error) => {
            console.warn('Cannot fetch location', error);
            this.geoPending = false;
            this.geoSupported = false;
          },
          { timeout: 7000 }
        );
      } else {
        this.geoPending = false;
        this.geoSupported = false;
      }
    },
    displayImage() {
      this.captured = true;
      this.getLocation();

      const file = this.$refs.input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          const image = new Image();
          image.src = e.target.result;
          image.addEventListener('load', (e) => {
            this.checkImageSize();
          });
          this.$store.commit('savePhoto', e.target.result);
          this.$store.commit('saveSize', this.size);
        });
        reader.readAsDataURL(file);
      }
    },
    checkImageSize() {
      const image = this.$refs.image;
      if (image.height > image.width) {
        this.$refs.image.style.height = this.size;
      } else {
        this.$refs.image.style.height = 'auto';
      }
    },
    clearPhoto() {
      this.$store.commit('savePhoto', false);
      this.photo = false;
      this.captured = false;
    },
  },
};
</script>

<style scoped>
main {
  display: grid;
  grid-template-rows: min-content auto;
}
video {
  width: 100%;
  background-color: #000;
  display: block;
  object-fit: cover;
  transform: scale(-1, 1);
}
canvas {
  max-width: 100%;
  animation: flash 0.3s ease 1;
}
img {
  max-width: 100%;
}
div.canvas {
  background-color: #eee;
  display: grid;
  place-items: center;
  width: 100%;
}
div.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
}
div.button {
  width: 50px;
  height: 50px;
  background-color: #00acc1;
  border-radius: 50%;
  color: #eceff1;
  display: grid;
  place-items: center;
}
div.button label {
  color: #eceff1;
}
div.shutter {
  width: 90px;
  height: 90px;
  background-color: #bbdefb;
  position: relative;
  border-radius: 50%;
}
div.shutter::after {
  content: '';
  width: 60px;
  height: 60px;
  background-color: #00acc1;
  position: absolute;
  top: 15px;
  left: 15px;
  border-radius: 50%;
}
.inactive {
  opacity: 0.5;
}
input[type='file'] {
  display: none;
}
@keyframes flash {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
