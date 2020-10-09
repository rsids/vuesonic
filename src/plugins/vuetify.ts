import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify);
export default new Vuetify({
  options: {
    customProperties: true
  },
  theme: {
    themes: {
      light: {
        primary: colors.cyan.base,
        secondary: colors.indigo.base,
        accent: colors.teal.base,
        error: colors.red.base,
        warning: colors.amber.base,
        info: colors.lightBlue.base,
        success: colors.lime.base
      }
    }
  }
});
