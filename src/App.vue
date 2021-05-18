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
import VSToolbar from "@/components/Toolbar.vue";
import { ui } from "@/store/modules/ui";
import { Component, Vue } from "vue-property-decorator";
import { server } from "@/store/modules/server";
import { search } from "@/store/modules/search";
import { stream } from "@/store/modules/stream";

const SEARCH_DELAY = 150;

@Component({
  name: "App",
  components: {
    VSToolbar,
    VSLogin,
    VSPlayer,
  },
})
export default class App extends Vue {
  @stream.Action init;
  @ui.Mutation setDrawer;

  @server.State hasCredentials;
  @search.State query!: string;
  @ui.State drawer!: boolean;

  searchDelay!: number;
  dialog = false;

  mounted(): void {
    this.init();
  }

  get showDrawer(): boolean {
    return this.drawer;
  }
  set showDrawer(val: boolean) {
    this.setDrawer(val);
  }
  get searchQuery(): string {
    return this.query;
  }
  set searchQuery(val: string) {
    clearTimeout(this.searchDelay);
    this.searchDelay = (setTimeout(() => {
      this.query = val;
    }, SEARCH_DELAY) as unknown) as number;
  }
}
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

.no-cover {
  background: #eeeeee;
}
.cover-container {
  position: relative;
}

.btn--play {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
