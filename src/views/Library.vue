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
export default {
  name: "VSLibrary"
};
</script>

<style scoped>
.main-container {
  margin-left: 50px;
}
</style>
