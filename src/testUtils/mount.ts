import {
  createLocalVue,
  mount,
  ThisTypedMountOptions,
  VueClass,
  Wrapper
} from "@vue/test-utils";
import { Vue } from "vue-property-decorator";
import Vuex from "vuex";
import Vuetify from "vuetify";

export function createWrapper<V extends Vue, T>(
  component: VueClass<V>,
  options?: ThisTypedMountOptions<V>
): Wrapper<V & T> {
  document.body.setAttribute("data-app", "true");
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const vuetify = new Vuetify();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mount(component, { localVue, vuetify, ...options }) as any;
}
