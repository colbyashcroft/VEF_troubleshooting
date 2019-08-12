<template>
  <v-app id="app-wrapper">
    <app-header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader';

export default {
  components: {
    AppHeader
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Catamaran:300,400,500,600,700&display=swap');
html {
  overflow: hidden;
}
.application {
  font-family: 'Catamaran', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

:focus {
  border: none !important;
  outline: none !important;
}

.vuetify {
  text-align: center;
  margin: 16px 0;
  color: #fff;
}

.copy {
  text-align: left;
  padding-left: 1rem;
}

.content > .container {
  padding: 1rem 3rem 0;
}
</style>
