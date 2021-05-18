import { AxiosStatic } from "axios";
import Vue from "vue";
import mockAxios from "jest-mock-axios";

const $axios = mockAxios.create();

export default {
  install(): void {
    Vue.prototype.axios = $axios;
  },
};

declare module "vue/types/vue" {
  interface Vue {
    axios: AxiosStatic;
  }
}
