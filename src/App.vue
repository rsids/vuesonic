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
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        v-model="searchQuery"
        prepend-inner-icon="mdi-search"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="main-content d-flex">
      <div class="d-flex">
        <v-btn icon class="btn--flex">
          <v-icon>mdi-home</v-icon>
          <span class="btn__content">Home</span>
        </v-btn>
        <v-btn icon class="btn--flex">
          <v-icon>mdi-music-box-multiple</v-icon>
          <span class="btn__content">Music Library</span>
        </v-btn>
      </div>
      <router-view v-if="hasCredentials"></router-view>
      <v-s-login :active="!hasCredentials"></v-s-login>
    </v-main>
    <v-s-player></v-s-player>
  </v-app>
</template>

<script lang="ts">
import VSLogin from "@/components/Login.vue";
import VSPlayer from "@/components/Player.vue";
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

let searchDelay;
const SEARCH_DELAY = 150;

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
    ...mapGetters("connection", ["hasCredentials"]),
    ...mapState("search", ["query"]),

    searchQuery: {
      get() {
        return this.query;
      },
      set(val) {
        clearTimeout(searchDelay);
        searchDelay = setTimeout(() => {
          this.query = val;
        }, SEARCH_DELAY);
      }
    }
  },
  methods: {
    ...mapActions("stream", ["init"])
  }
});
</script>

<style lang="scss">
.main-content {
  background: #efefef;
  margin-bottom: 90px;
}

.btn--flex {
  .btn__content {
    font-size: 0.8em;
    text-transform: none;
  }
  .v-btn__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
