<template>
  <v-app>
    <v-navigation-drawer
      v-model="showDrawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item link to="/recents">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Home </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/library">
          <v-list-item-action>
            <v-icon>mdi-music-box-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Music Library </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/settings">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Settings </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-s-toolbar></v-s-toolbar>

    <v-main class="main-content">
      <div class="pt-8">
        <router-view v-if="hasCredentials" :key="$route.fullPath"></router-view>
      </div>
      <v-s-login :active="!hasCredentials"></v-s-login>
    </v-main>
    <v-s-player></v-s-player>
  </v-app>
</template>

<script lang="ts">
import VSLogin from "@/components/Login.vue";
import VSPlayer from "@/components/Player.vue";
import Vue from "vue";
import { mapActions, mapMutations, mapState } from "vuex";
import VSToolbar from "@/components/Toolbar.vue";
import { SET_DRAWER } from "@/store/modules/ui";

let searchDelay: number;
const SEARCH_DELAY = 150;

export default Vue.extend({
  name: "App",

  components: {
    VSToolbar,
    VSLogin,
    VSPlayer
  },

  data: (): unknown => ({
    dialog: false,
    tab: null,
    items: ["web", "shopping", "videos", "images", "news"]
  }),

  mounted(): void {
    this.init();
  },

  computed: {
    ...mapState("connection", ["hasCredentials"]),
    ...mapState("search", ["query"]),
    ...mapState("ui", ["drawer"]),
    showDrawer: {
      get() {
        return this.drawer;
      },
      set(val) {
        this[SET_DRAWER](val);
      }
    },
    searchQuery: {
      get() {
        return this.query;
      },
      set(val) {
        clearTimeout(searchDelay);
        searchDelay = (setTimeout(() => {
          this.query = val;
        }, SEARCH_DELAY) as unknown) as number;
      }
    }
  },
  methods: {
    ...mapActions("stream", ["init"]),
    ...mapMutations("ui", [SET_DRAWER])
  }
});
</script>

<style lang="scss">
.main-content {
  background: #efefef;
  margin-bottom: 90px;
}
.button-bar {
  margin-top: 20px;
}

.btn--flex {
  color: #616161 !important;
  margin-bottom: 20px;

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
