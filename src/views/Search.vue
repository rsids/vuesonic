<template
  ><v-container fluid>
    <h2>Search results for "{{ query }}"</h2>
    <v-container fluid>
      <!--    <v-row dense align-content="start" justify="start" v-if="recents">-->
      <!--      <v-s-album-card-->
      <!--          :album="album"-->
      <!--          v-for="(album, i) in recents"-->
      <!--          :key="i"-->
      <!--      ></v-s-album-card>-->
      <!--    </v-row>-->
    </v-container>
  </v-container></template
>

<script>
export default {
  name: "Search",
  computed: {
    query() {
      return this.$route.params.query;
    }
  }
};
</script>

<style scoped></style>
