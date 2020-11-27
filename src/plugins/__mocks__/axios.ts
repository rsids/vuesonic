import axios, { AxiosResponse, AxiosStatic } from "axios";
import Vue from "vue";
import { SubsonicError } from "@/store/interfaces/subsonicResponse";

const $axios = axios.create({});

$axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.headers["content-type"].startsWith("application/json")) {
      if (response.data["subsonic-response"].status == "ok") {
        return response.data["subsonic-response"];
      } else {
        return Promise.reject(
          response.data["subsonic-response"] as SubsonicError
        );
      }
    }
    return response;
  },
  (err) => {
    Promise.reject(err);
  }
);

Vue.use({
  install() {
    Vue.prototype.axios = $axios;
  },
});

declare module "vue/types/vue" {
  interface Vue {
    axios: AxiosStatic;
  }
}
