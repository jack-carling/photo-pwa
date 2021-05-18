<template>
  <main>
    <div v-show="!captured" ref="vcontainer">
      <video autoplay ref="video"></video>
    </div>
    <div v-show="captured" class="canvas" ref="container"><canvas ref="canvas"></canvas></div>
    <div class="controls" v-if="!captured">
      <div class="button">
        <i class="material-icons">upload</i>
      </div>
      <div class="shutter" @click="takePhoto"></div>
      <div class="button" @click="toggleFacingMode">
        <i class="material-icons">loop</i>
      </div>
    </div>
    <div class="controls" v-else>
      <div class="button">
        <template v-if="geoPending">
          <Preloader />
        </template>
        <template v-else>
          <i v-if="geoSupported" class="material-icons">location_on</i>
          <i v-else class="material-icons">location_off</i>
        </template>
      </div>
      <div class="button">
        <i class="material-icons">done</i>
      </div>
      <div class="button" @click="captured = false">
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
    this.track.stop();
  },
  data() {
    return {
      captured: false,
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
  },
  methods: {
    setAspectRatio() {
      this.$refs.video.style.height = this.size;
      this.$refs.container.style.height = this.size;
      this.$refs.vcontainer.style.height = this.size;
    },
    takePhoto() {
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
      this.captured = true;
      this.getLocation();
    },
    toggleFacingMode() {
      this.facingMode = this.facingMode === 'user' ? { exact: 'environment' } : 'user';
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
            console.log(res);
            if (res?.success === false) {
              this.geoSupported = false;
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
}
div.canvas {
  background-color: #000;
  display: grid;
  place-items: center;
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
</style>
