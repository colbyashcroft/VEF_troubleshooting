import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'masterDocs',
    //   component: () => import('./views/MasterDocsAll')
    // },
    {
      path: '/masterDoc/:masterDocId',
      name: 'masterDoc',
      component: () => import('./views/MasterDoc'),
      props: true,
      beforeRouteEnter(to, from, next) {
        console.log('test');
        store
          .dispatch('masterDoc/checkMasterDocAccessPersmissions', to.params.masterDocId)
          .then(() => {
            console.log('allowed');
            next();
          })
          .catch(e => {
            console.log('not allowed', e);
            next({ path: '/' });
          });
      }
    }
  ]
})
