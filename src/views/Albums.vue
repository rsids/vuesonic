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

<script lang="ts">
import { mapActions, mapState } from "vuex";
import VSAlbumCard from "@/components/AlbumCard";

export default {
  name: "Albums",
  components: { VSAlbumCard },
  data(): unknown {
    return {
      loading: true,
    };
  },
  mounted(): void {
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

    getAlbumSet(): void {
      this.loading = true;
      this.getAlbums({ start: this.albums.length }).then(() => {
        this.loading = false;
      });
    },

    onIntersect(
      _entries: unknown,
      _observer: IntersectionObserver,
      isIntersecting: boolean
    ): void {
      if (!this.loading && isIntersecting) {
        this.getAlbumSet();
      }
    },
  },
};
</script>
