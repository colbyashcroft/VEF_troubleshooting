import Vue from 'vue';
import VueMultianalytics from 'vue-multianalytics';
import router from '../router';
//  Setup mixpanel
const mixpanelConfig = {
  token: '3121ce1d65e0c7f27337ec58924feac9'
};

Vue.use(VueMultianalytics, {
  modules: {
    mixpanel: mixpanelConfig
  },
  routing: {
    vueRouter: router, //  Pass the router instance to automatically sync with router (optional)
    preferredProperty: 'name', // By default 'path' and related with vueRouter (optional)
    ignoredViews: [], // Views that will not be tracked
    ignoredModules: [] // Modules that will not send route change events. The event sent will be this.$ma.trackView({viewName: 'homepage'}, ['ga'])
  }
});
