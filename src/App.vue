<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item link to="/recents">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/library">
          <v-list-item-action>
            <v-icon>mdi-music-box-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Music Library
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/settings">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Settings
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        VueSonic
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content class="main-content">
      <router-view v-if="hasCredentials"></router-view>
      <v-s-login :active="!hasCredentials"></v-s-login>
    </v-content>
    <v-s-player></v-s-player>
  </v-app>
</template>

<script lang="ts">
import VSLogin from "@/components/Login.vue";
import VSPlayer from "@/components/Player.vue";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

export default Vue.extend({
  name: "App",

  components: {
    VSLogin,
    VSPlayer
  },

  data: () => ({
    dialog: false,
    drawer: false
  }),

  mounted() {
    this.init();
  },

  computed: {
    ...mapGetters("connection", ["hasCredentials"])
  },
  methods: {
    ...mapActions("stream", ["init"])
  }
});
</script>

<style>
.main-content {
  background: #efefef;
  margin-bottom: 90px;
}
</style>
