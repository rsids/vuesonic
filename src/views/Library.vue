<template>
  <div>
    <v-tabs>
      <v-tab :to="{ name: 'playlists' }">Playlists</v-tab>
      <v-tab :to="{ name: 'artists' }">Artists</v-tab>
      <v-tab :to="{ name: 'albums' }">Albums</v-tab>
      <v-tab>Songs</v-tab>
      <v-tab>Genres</v-tab>
    </v-tabs>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
import { SET_TABS } from "@/store/modules/ui";
import { mapMutations } from "vuex";

export default {
  name: "VSLibrary",
  mounted() {
    this[SET_TABS](["playlists", "artists", "albums", "songs", "genres"]);
  },
  destroyed() {
    this[SET_TABS]([]);
  },
  computed: {
    ...mapMutations("ui", [SET_TABS])
  }
};
</script>

<style scoped>
.main-container {
  margin-left: 50px;
}
</style>
