import { SubsonicError } from "@/store/SubsonicResponse";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic
} from "axios";
import Vue from "vue";
import store from "../store";

const $axios = axios.create({});

$axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const server = store.getters["connection/server"];
    config.baseURL = `${server}/rest/`;
    config.params = {
      ...config.params,
      ...store.getters["connection/params"]
    };
    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);

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
  err => {
    Promise.reject(err);
  }
);

Vue.use({
  install() {
    Vue.prototype.axios = $axios;
  }
});

declare module "vue/types/vue" {
  interface Vue {
    axios: AxiosStatic;
  }
}
