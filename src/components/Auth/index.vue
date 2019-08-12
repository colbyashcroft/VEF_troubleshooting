<template>
  <div id="auth"></div>
</template>

<script>
import { mapActions } from 'vuex';
import 'firebaseui/dist/firebaseui.css';

export default {
  mounted() {
    this.firebaseUiRegister('#auth');
  },
  methods: {
    ...mapActions('auth', ['firebaseUiRegister'])
  }
};
</script>

<style></style>
