<template>
  <v-container>
    <v-row dense>
      <v-col
        ><h2 class="mb-4">Search results for "{{ query }}"</h2>
        <h3 v-if="artists.length > 0" class="d-flex">
          <span>Artists</span>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            v-if="hasMoreArtists"
            @click="seeAll('artists')"
            >See All</v-btn
          >
        </h3>
      </v-col>
    </v-row>
    <v-row
      dense
      align-content="start"
      justify="start"
      class="mb-4"
      v-if="artists.length > 0"
    >
      <v-s-artist-card
        v-for="(artist, i) in artists"
        :key="i"
        :artist="artist"
      ></v-s-artist-card>
    </v-row>

    <v-row v-if="albums.length > 0">
      <v-col>
        <h3 class="d-flex">
          <span>Albums</span>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            v-if="hasMoreAlbums"
            @click="seeAll('albums')"
            >See All</v-btn
          >
        </h3>
      </v-col>
    </v-row>

    <v-row
      align-content="start"
      justify="start"
      class="mb-4"
      v-if="albums.length > 0"
    >
      <v-s-album-card
        v-for="(album, i) in albums"
        :key="i"
        :album="album"
      ></v-s-album-card>
    </v-row>

    <v-row v-if="songs.length > 0">
      <v-col>
        <h3 class="d-flex">
          <span>Songs</span>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            v-if="hasMoreSongs"
            @click="seeAll('songs')"
            >See All</v-btn
          >
        </h3>
      </v-col>
    </v-row>

    <v-container fluid v-if="songs.length > 0">
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

<script lang="ts">
import { mapActions, mapState } from "vuex";
import VSArtistCard from "@/components/ArtistCard";
import VSAlbumCard from "@/components/AlbumCard";
import VSSavePlaylist from "@/components/SavePlaylist";
import VSSonglist from "@/components/Songlist";

export default {
  name: "Search",
  components: { VSSonglist, VSSavePlaylist, VSAlbumCard, VSArtistCard },
  computed: {
    ...mapState("search", [
      "artists",
      "albums",
      "songs",
      "hasMoreAlbums",
      "hasMoreArtists",
      "hasMoreSongs",
    ]),
    query(): string {
      return this.$route.params.query;
    },
  },

  methods: {
    ...mapActions("search", ["search", "searchMore"]),

    seeAll(type: string): void {
      this.searchMore({ type });
    },
  },

  mounted(): void {
    this.search({ query: this.query });
  },
};
</script>
