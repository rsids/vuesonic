<template>
  <v-app-bar
    app
    color="primary"
    dark
    :clipped-left="$vuetify.breakpoint.lgAndUp"
  >
    <v-app-bar-nav-icon
      @click.stop="showDrawer = !showDrawer"
    ></v-app-bar-nav-icon>
    <div class="d-flex align-center">VueSonic</div>

    <v-spacer></v-spacer>
    <v-text-field
      solo-inverted
      flat
      hide-details
      label="Search"
      v-model="searchQuery"
      @keypress.enter="doSearch()"
      prepend-inner-icon="mdi-search"
    ></v-text-field>
    <v-spacer></v-spacer>
    <template v-slot:extension>
      <v-tabs v-model="tab" centered>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in toolbarTabs" :key="item" :to="{ name: item }">
          {{ item }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const ui = namespace("ui");

@Component({
  name: "VSToolbar",
})
export default class Toolbar extends Vue {
  @ui.State drawer;
  @ui.State tabs;

  @ui.Mutation setDrawer;

  searchQuery = "";
  tab = "";

  get toolbarTabs(): string[] {
    return this.tabs;
  }

  get showDrawer(): boolean {
    return this.drawer;
  }
  set showDrawer(val: boolean) {
    this.setDrawer(val);
  }

  doSearch(): void {
    this.$router.push({
      name: "search",
      params: { query: this.searchQuery },
    });
  }
}
</script>
