import Vue from "vue";
import Vuetify from "vuetify";
import Vuelidate from "vuelidate";

import IntersectionObserver from "vue-intersect/__mocks__/intersection-observer";

global.IntersectionObserver = IntersectionObserver;
Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(Vuetify);
