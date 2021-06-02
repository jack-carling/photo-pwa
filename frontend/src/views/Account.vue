<template>
  <main v-if="online">
    <h1>Account</h1>
    <p>Logged in as: {{ displayName }}</p>
    <button class="btn waves-effect waves-light cyan darken-1" @click="logout">Logout</button>
  </main>
  <main v-else>
    <section v-if="loginPage">
      <h4>Login</h4>
      <div class="input-field">
        <input id="email" type="email" autocomplete="off" v-model="email" @keyup.enter="login" />
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password" @keyup.enter="login" />
        <label for="password">Password</label>
      </div>
      <p class="error animate__animated animate__headShake" v-if="error">
        <i class="material-icons">error</i>
        Email or password is incorrect.
      </p>
      <button class="btn waves-effect waves-light cyan darken-1" @click="login">Login</button>
      <p>Not a user yet? <a @click="loginPage = false">Register account</a></p>
    </section>
    <section v-else>
      <h4>Register</h4>
      <div class="input-field">
        <input id="name" type="text" autocomplete="off" v-model="name" @keyup.enter="register" />
        <label for="name">Username</label>
      </div>
      <div class="input-field">
        <input id="email" type="email" autocomplete="off" v-model="email" @keyup.enter="register" />
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password" @keyup.enter="register" />
        <label for="password">Password</label>
      </div>
      <div class="input-field">
        <input id="confirm-password" type="password" v-model="confirmPassword" @keyup.enter="register" />
        <label for="confirm-password">Confirm Password</label>
      </div>
      <p class="error animate__animated animate__headShake" v-if="registerError">
        <i class="material-icons">error</i>
        {{ registerError }}
      </p>
      <button class="btn waves-effect waves-light cyan darken-1" @click="register">Register</button>
      <p>Already a user? <a @click="loginPage = true">Login</a></p>
    </section>
    <p class="redirect animate__animated animate__bounceIn" v-if="redirect">
      <i class="material-icons">notifications</i>
      {{ redirect }}
    </p>
  </main>
</template>

<script>
import mongoosy from 'mongoosy/frontend';
const { User } = mongoosy;

import { testName, testEmail, testPassword } from '../services/validate.js';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      loginPage: true,
      registerError: '',
      redirect: false,
    };
  },
  computed: {
    online() {
      return this.$store.state.user.online;
    },
    displayName() {
      return this.$store.state.user.name;
    },
    error() {
      return this.$store.state.accountError;
    },
  },
  methods: {
    async register() {
      this.wiggleErrors();
      const nameTest = testName(this.name);
      if (nameTest) {
        this.registerError = nameTest;
        return;
      }
      const emailTest = testEmail(this.email);
      if (emailTest) {
        this.registerError = emailTest;
        return;
      }
      const passwordTest = testPassword(this.password);
      if (passwordTest) {
        this.registerError = passwordTest;
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.registerError = 'Passwords need to match.';
        return;
      }
      let user = new User({
        name: this.name,
        email: this.email,
        password: this.password,
      });
      const res = await user.save();
      let error = res.error ?? false;
      if (error?.keyValue) {
        error = Object.keys(error.keyValue).join('');
      }
      if (error === 'name') {
        this.registerError = 'This username is already taken.';
      } else if (error === 'email') {
        this.registerError = 'This email already exists.';
      }
      if (!error) {
        const payload = { email: this.email, password: this.password };
        this.$store.dispatch('login', payload);
        this.loginPage = true;
      }
    },
    async login() {
      const payload = { email: this.email, password: this.password };
      this.$store.dispatch('login', payload);
      this.wiggleErrors();
    },
    async logout() {
      this.$store.dispatch('logout');
    },
    wiggleErrors() {
      const error = document.querySelector('.error');
      if (error) {
        error.classList.remove('animate__headShake');
        void error.offsetWidth; // Hack to restart CSS animation
        error.classList.add('animate__headShake');
      }
    },
    clear() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.redirect = '';
      this.$store.commit('clearErrors');
      const labels = document.querySelectorAll('label');
      labels.forEach((label) => label.classList.remove('active'));
    },
    isRedirected() {
      if (this.$route.query.redirect === 'chat') {
        this.redirect = 'Please login to access chat.';
      } else if (this.$route.query.redirect === 'camera') {
        this.redirect = 'Please login to upload photos or images.';
      } else if (this.$route.query.redirect === 'signup') {
        this.loginPage = false;
      } else {
        this.redirect = '';
      }
    },
  },
  watch: {
    loginPage() {
      this.clear();
    },
    online() {
      this.clear();
    },
    '$route.query.redirect'() {
      this.isRedirected();
    },
  },
  beforeUnmount() {
    this.$store.commit('clearErrors');
  },
  mounted() {
    this.isRedirected();
  },
};
</script>

<style scoped>
h4 {
  margin: 0 0 2rem 0;
}
p.error {
  display: flex;
  align-items: center;
  color: #607d8b;
}
p.redirect {
  border: 1px solid #607d8b;
  color: #607d8b;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
p.error i,
p.redirect i {
  margin-right: 0.5rem;
}
</style>
