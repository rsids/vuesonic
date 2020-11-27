<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="albums">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in albums"
          :key="i"
        ></v-s-album-card>
        <div v-intersect="onIntersect" style="visibility: hidden">
          INTERSECTOR
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSAlbumCard from "@/components/AlbumCard";

export default {
  name: "Albums",
  components: { VSAlbumCard },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    if (this.albums.length === 0) {
      this.getAlbumSet();
    } else {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  },

  computed: {
    ...mapState("album", ["albums"]),
  },
  methods: {
    ...mapActions("album", ["getAlbums"]),

    getAlbumSet() {
      this.loading = true;
      this.getAlbums({ start: this.albums.length }).then(() => {
        this.loading = false;
      });
    },

    onIntersect(_entries, _observer, isIntersecting) {
      if (!this.loading && isIntersecting) {
        this.getAlbumSet();
      }
    },
  },
};
</script>
