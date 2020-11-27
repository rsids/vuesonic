import Vue from "vue";
import Vuetify from "vuetify";
import Vuelidate from "vuelidate";
import http from "./../src/plugins/__mocks__/axios";
import IntersectionObserver from "./../__mocks__/IntersectionObserver";

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(Vuetify);
Vue.use(http);

window.IntersectionObserver = IntersectionObserver;
