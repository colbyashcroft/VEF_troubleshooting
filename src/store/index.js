import Vue from 'vue';
import Vuex from 'vuex';
import VuexEasyFirestore from 'vuex-easy-firestore';
import fb from '../firebaseConfig';
import router from '../router';

// Import Modules
import auth from './auth';
import masterDocModule from './database/masterDoc';
import views from './views/index';
// add vuex to vue
Vue.use(Vuex);

// do the magic 🧙🏻‍
const easyFirestore = VuexEasyFirestore([masterDocModule], {
  logging: true,
  FirebaseDependency: fb.firebase
});

const storeData = {
  plugins: [easyFirestore],
  modules: {
    auth,
    views
  }
};
const store = new Vuex.Store(storeData);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('auth/setCurrentUser', user);
    store.dispatch('auth/subscribeToUser');
  }
});

export default store;
