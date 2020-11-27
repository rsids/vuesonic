import vuetify from "@/plugins/vuetify";
import VuetifyDialog from "vuetify-dialog";
import Vue from "vue";
import "vuetify-dialog/dist/vuetify-dialog.css";

Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});
