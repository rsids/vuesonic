import { User } from "@/store/interfaces/user";
import { UserResponse } from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class UserStore extends VuexModule {
  user: User | null = null;

  @Mutation
  setUser(value: User): void {
    this.user = value;
  }

  @Action
  getUser({ user }: { user: User }): Promise<User> {
    return new Promise((resolve, reject) => {
      Vue.prototype.axios
        .get(`getUser?username=${user}`)
        .then((response: UserResponse) => {
          this.context.commit("setUser", response.user);
          resolve(this.user as User);
        })
        .catch(() => {
          reject({
            code: 70
          });
        });
    });
  }

  @Action
  getUsers(): void {
    throw new Error("Not implemented");
  }

  @Action
  createUser(): void {
    throw new Error("Not implemented");
  }

  @Action
  updateUser(): void {
    throw new Error("Not implemented");
  }

  @Action
  deleteUser(): void {
    throw new Error("Not implemented");
  }

  @Action
  changePassword(): void {
    throw new Error("Not implemented");
  }
}
