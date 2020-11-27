import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import http from "./plugins/axios";
import vuetify from "./plugins/vuetify";
import "./plugins/vuetify-dialog";

Vue.config.productionTip = false;
Vue.use(http);
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
