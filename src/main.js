import Vue from 'vue'

//  Plugins
import './plugins/vuetify'
import './plugins/analytics'
import './filters';
import { sync } from 'vuex-router-sync';

import App from './App.vue'
import router from './router'
import store from './store/'


// import firebase
import fb from './firebaseConfig';

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.configureWebpack = { devtool: 'source-map' };

//  Setup sync from router to store
sync(store, router);

let app;

fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    });
  }
});
