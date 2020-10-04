<template>
  <v-container fluid>
    <h2 class="mb-4">Search results for "{{ query }}"</h2>
    <h3>Artists</h3>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="artists">
        <v-s-artist-card
          v-for="(artist, i) in artists"
          :key="i"
          :artist="artist"
        ></v-s-artist-card>
      </v-row>
    </v-container>

    <h3>Albums</h3>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="albums">
        <v-s-album-card
          v-for="(album, i) in albums"
          :key="i"
          :album="album"
        ></v-s-album-card>
      </v-row>
    </v-container>
    <h3>Songs</h3>

    <v-container fluid v-if="songs && songs.length > 0">
      <v-row>
        <v-s-songlist
          :songs="songs"
          :full="true"
          :numbering="'none'"
        ></v-s-songlist>
        <v-s-save-playlist
          label="Save as playlist"
          :songs="songs"
        ></v-s-save-playlist>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSArtistCard from "@/components/ArtistCard";
import VSAlbumCard from "@/components/AlbumCard";
import VSSavePlaylist from "@/components/SavePlaylist";
import VSSonglist from "@/components/Songlist";

export default {
  name: "Search",
  components: { VSSonglist, VSSavePlaylist, VSAlbumCard, VSArtistCard },
  computed: {
    ...mapState("search", ["artists", "albums", "songs"]),
    query() {
      return this.$route.params.query;
    }
  },

  methods: {
    ...mapActions("search", ["search"])
  },

  mounted() {
    this.search({ query: this.query });
  }
};
</script>

<style scoped></style>
