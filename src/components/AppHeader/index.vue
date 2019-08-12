<template>
  <v-toolbar app dense color="primary" class="pl-0" dark style="cursor: pointer;">
    <v-btn flat icon @click="$router.push('/');"> <v-icon>view_module</v-icon> </v-btn>
    <v-toolbar-title @click="$router.push('/');">masterDoc</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="isUser">
      <v-menu bottom origin="top right" transition="v-scale-transition" key="profileMenu">
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <user-avatar size="25px" class="grey lighten-4" :avatarUrl="avatar"></user-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile> <v-list-tile-title>Change Account</v-list-tile-title> </v-list-tile>
          <v-list-tile> <v-list-tile-title>Invite Friends</v-list-tile-title> </v-list-tile>
          <v-list-tile @click="logOut">
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar-items v-else class="">
      <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      key="Sig in menu"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" flat>
          Sign in / Sign up
        </v-btn>
      </template>

      <v-card class="pa-2">
        <auth />
      </v-card>
    </v-menu>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import JoinForm from './auth/JoinForm';
// import SignInForm from './auth/SignInForm.vue';
import Auth from '../Auth';
import UserAvatar from '../UserAvatar';

export default {
  name: 'AppHeader',
  components: {
    // JoinForm,
    // SignInForm,
    UserAvatar,
    Auth
  },
  data() {
    return {
      signupDialog: false,
      loginDialog: false
    };
  },
  computed: {
    ...mapGetters('auth', ['isUser', 'avatar']),
    ...mapActions('auth', ['logout'])
  },
  methods: {
    cancelSignin: function() {
      this.loginDialog = false;
    },
    logOut() {
      this.logout;
    }
  }
};
</script>

<style>
.toolbar__title {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.02em;
  margin-left: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
