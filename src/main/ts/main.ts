import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faSave } from '@fortawesome/free-solid-svg-icons';

import '@/css/bootstrap.scss';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.component('font-awesome-icon', FontAwesomeIcon);

library.add(faSave);

export const eventBus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
