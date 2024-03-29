import { salt } from "@/utils/generic";
import { Md5 } from "ts-md5";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { namespace } from "vuex-class";
import Vue from "vue";
import { ScanStatusResponse } from "@/store/interfaces/subsonicResponse";
import { ScanStatus } from "@/store/interfaces/scanStatus";

interface ConnectionParams {
  u: string;
  t: string;
  s: string;
  c: string;
  f: string;
  v: string;
}

export const server = namespace("server");

@Module({ namespaced: true })
export default class ServerStore extends VuexModule {
  password = sessionStorage.getItem("password") || "";
  _server = sessionStorage.getItem("server") || "";
  username = sessionStorage.getItem("username") || "";
  hasCredentials = !!sessionStorage.getItem("server");
  scanStatus: ScanStatus = { scanning: false, count: 0 };

  @Mutation
  setHasCredentials(value: boolean): void {
    this.hasCredentials = value;
  }

  @Mutation
  setScanStatus(value: ScanStatus): void {
    this.scanStatus = { ...value };
    console.log(this.scanStatus);
  }

  @Action
  clearCredentials(): void {
    sessionStorage.clear();
    this.context.commit("setHasCredentials", false);
  }

  @Action({ commit: "setScanStatus" })
  async getScanStatus(): Promise<ScanStatus> {
    const response: ScanStatusResponse = await Vue.prototype.axios.get(
      `getScanStatus`
    );
    return response.scanStatus;
  }

  @Action({ commit: "setScanStatus" })
  async startScan(): Promise<ScanStatus> {
    const response: ScanStatusResponse = await Vue.prototype.axios.get(
      `startScan`
    );
    return response.scanStatus;
  }

  @Mutation
  storeCredentials({
    user,
    password,
    server,
  }: {
    user: string;
    password: string;
    server: string;
  }): void {
    if (server.endsWith("/")) {
      server = server.substr(0, server.length - 1);
    }
    this.username = user;
    this.password = password;
    this._server = server;
    this.hasCredentials = true;

    sessionStorage.setItem("username", user);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("server", server);
  }

  @Action
  getUrl({ url }: { url: string }): string {
    const fullUrl = new URL(`${this._server}/rest/${url}`);
    const params = this.params;
    for (const paramsKey in params) {
      fullUrl.searchParams.append(paramsKey, params[paramsKey]);
    }
    return fullUrl.toString();
  }

  get server(): string {
    return this._server;
  }

  get params(): ConnectionParams {
    const salted = salt();
    const token = new Md5()
      .appendStr(this.password)
      .appendStr(salted)
      .end()
      .toString();
    return {
      u: this.username,
      t: token,
      s: salted,
      c: "vuesonic",
      f: "json",
      v: "1.15.0",
    };
  }
}
