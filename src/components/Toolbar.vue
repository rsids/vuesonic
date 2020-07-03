<template>
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
    <template v-slot:extension>
      <v-tabs align-with-title v-model="tab">
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in toolbarTabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "VSToolbar",
  data() {
    return {
      drawer: false,
      searchQuery: "",
      tab: ""
    };
  },
  computed: {
    ...mapState("ui", ["tabs"]),
    toolbarTabs: {
      get() {
        return this.tabs;
      }
    }
  }
};
</script>

<style scoped></style>
<!--
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
    <template v-slot:extension>
      <v-tabs v-model="tab" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab v-for="item in tabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>  -->
