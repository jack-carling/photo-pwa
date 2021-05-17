<template>
  <main>
    <video v-show="!captured" autoplay ref="video"></video>
    <div v-show="captured" class="canvas" ref="container"><canvas ref="canvas"></canvas></div>
    <div class="controls" v-if="!captured">
      <div class="button">
        <i class="material-icons">upload</i>
      </div>
      <div class="shutter" @click="takePhoto"></div>
      <div class="button">
        <i class="material-icons">loop</i>
      </div>
    </div>
    <div class="controls" v-else>
      <div class="button">
        <i class="material-icons">location_on</i>
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
export default {
  async mounted() {
    const constraints = { video: true };
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
        this.setAspectRatio();
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
  data() {
    return {
      captured: false,
    };
  },
  computed: {
    size() {
      return this.$refs.video.clientWidth + 'px';
    },
  },
  methods: {
    setAspectRatio() {
      this.$refs.video.style.height = this.size;
      this.$refs.container.style.height = this.size;
    },
    takePhoto() {
      const canvas = this.$refs.canvas;
      const media = this.$refs.video;
      canvas.width = media.videoWidth;
      canvas.height = media.videoHeight;
      let context = canvas.getContext('2d');
      context.drawImage(media, 0, 0, media.videoWidth, media.videoHeight);
      this.captured = true;
      //, media.videoWidth, media.videoHeight
      /* get the scale
      const scale = Math.max(canvas.width / media.videoWidth, canvas.height / media.videoHeight);
      // get the top left position of the image
      const x = canvas.width / 2 - (media.videoWidth / 2) * scale;
      const y = canvas.height / 2 - (media.videoHeight / 2) * scale;
      context.drawImage(media, x, y, media.videoWidth * scale, media.videoHeight * scale);*/
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
</style>
