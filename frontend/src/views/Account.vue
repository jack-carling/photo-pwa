<template>
  <main v-if="online">
    <h1>Account</h1>
    <button class="btn cyan darken-1" @click="logout">Logout</button>
  </main>
  <main v-else>
    <section v-if="loginPage">
      <h4>Login</h4>
      <div class="input-field">
        <input id="email" type="email" autocomplete="off" v-model="email" />
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password" />
        <label for="password">Password</label>
      </div>
      <button class="btn cyan darken-1" @click="login">Login</button>
      <p>Not a user yet? <a @click="loginPage = false">Register account</a></p>
    </section>
    <section v-else>
      <h4>Register</h4>
      <div class="input-field">
        <input id="name" type="text" autocomplete="off" v-model="name" />
        <label for="name">Username</label>
      </div>
      <div class="input-field">
        <input id="email" type="email" autocomplete="off" v-model="email" />
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password" />
        <label for="password">Password</label>
      </div>
      <button class="btn cyan darken-1" @click="register">Register</button>
      <p>Already a user? <a @click="loginPage = true">Login</a></p>
    </section>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { User, Login } = mongoosy;

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      loginPage: true,
    };
  },
  computed: {
    online() {
      return this.$store.state.user.online;
    },
  },
  methods: {
    async register() {
      let user = new User({
        name: this.name,
        email: this.email,
        password: this.password,
      });
      const res = await user.save();
      const error = res.error ?? false;
      if (!error) {
        const payload = { email: this.email, password: this.password };
        this.$store.dispatch('login', payload);
        this.clear();
      }
    },
    async login() {
      const payload = { email: this.email, password: this.password };
      this.$store.dispatch('login', payload);
      this.clear();
    },
    async logout() {
      this.$store.dispatch('logout');
    },
    clear() {
      this.name = '';
      this.email = '';
      this.password = '';
    },
  },
};
</script>

<style scoped>
h4 {
  margin: 0 0 1rem 0;
}
</style>
