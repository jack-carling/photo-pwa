<template>
  <main>
    <section class="image">
      <img :src="image.url" alt="" />
      <div @click="startChat(image._id, 'photo')">
        <i class="material-icons">question_answer</i>
      </div>
    </section>
    <div>
      <span class="info">
        <i class="material-icons">account_circle</i>
        Info
      </span>
      <div class="chip" @click="startChat(id, 'private')">
        <span v-html="name"></span>
        <i class="material-icons">question_answer</i>
      </div>
      <div class="chip">
        {{ time }}
        <i class="material-icons">calendar_today</i>
      </div>

      <section class="info" v-if="location">
        <span class="info">
          <i class="material-icons">location_on</i>
          Location
        </span>
        <div class="chip" @click="startChat(location, 'location')">
          <span>{{ location }}</span>
          <i class="material-icons">question_answer</i>
        </div>
      </section>

      <section class="info" v-if="tags.length">
        <span class="info">
          <i class="material-icons">extension</i>
          Tags
        </span>
        <div class="chip" v-for="(tag, i) in tags" :key="i" @click="startChat(tag, 'tag')">
          <span>{{ tag }}</span>
          <i class="material-icons">question_answer</i>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';

const { User } = mongoosy;

export default {
  data() {
    return {
      name: '&nbsp;',
    };
  },
  computed: {
    image() {
      return this.$store.state.image;
    },
    location() {
      if (this.image.location === 'hide') {
        return false;
      } else {
        return this.image.location?.toLowerCase();
      }
    },
    tags() {
      if (this.image?.tags) {
        return this.image.tags;
      } else {
        return '';
      }
    },
    time() {
      const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
      const time = new Date(this.image.time);
      return time.toLocaleString('sv-SE', options);
    },
    id() {
      return this.image.user;
    },
  },
  mounted() {
    this.getName();
    if (Object.keys(this.image).length === 0) {
      this.$router.push('/search');
    }
  },
  methods: {
    async getName() {
      if (this.image?.user) {
        const { name } = await User.findById(this.image.user);
        this.name = name;
      }
    },
    startChat(id, type) {
      this.$router.push(`/chat?id=${id}&type=${type}`);
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
}
div.chip i {
  cursor: pointer;
  float: right;
  font-size: 16px;
  line-height: 32px;
  padding-left: 8px;
}
span.info {
  display: block;
  border-bottom: 1px solid #eceff1;
  margin-bottom: 1rem;
  padding-bottom: 0.2rem;
  display: flex;
  align-items: center;
}
section.info {
  padding-top: 1rem;
}
span.info i {
  font-size: 16px;
  margin-right: 0.3rem;
  color: #5b5b5b;
}
section.image {
  position: relative;
}
section.image div {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background-color: #e4e4e4;
}
div i {
  color: #5b5b5b;
}
</style>
