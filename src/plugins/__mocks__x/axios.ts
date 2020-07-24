import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  SubsonicError,
  SubsonicResponse
} from "@/store/interfaces/subsonicResponse";

export const $axios = axios.create({});
$axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.baseURL = `http://localhost/`;
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
    // eslint-disable-next-line no-console
    console.log(response);
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
    // eslint-disable-next-line no-console
    console.log("intercptr error", err);
    return Promise.reject(err);
  }
);
