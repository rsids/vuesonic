import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../store";
import {
  SubsonicError,
  SubsonicResponse
} from "@/store/interfaces/subsonicResponse";

export const $axios = axios.create({});

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
  (
    response: AxiosResponse
  ): SubsonicResponse | Promise<SubsonicError> | any => {
    if (response.headers["content-type"].startsWith("application/json")) {
      if (response.data["subsonic-response"].status == "ok") {
        return response.data["subsonic-response"] as SubsonicResponse;
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
