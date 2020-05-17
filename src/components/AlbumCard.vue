<template>
  <v-card :to="albumUrl" class="ma-3" max-width="200px" width="200px">
    <v-img :src="cover" max-width="200px" max-height="200px" aspect-ratio="1">
    </v-img>
    <v-card-title class="subtitle-1">
      <div class="text-no-wrap text-truncate" v-text="album.album"></div>
    </v-card-title>
    <v-card-subtitle>
      <div class="text-no-wrap text-truncate" v-text="album.artist"></div>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { Album } from "@/store/interfaces/album";

export default {
  name: "VSAlbumCard",
  props: {
    album: Album
  },
  data() {
    return {
      cover: ""
    };
  },
  mounted() {
    if (this.album) {
      this.getArt();
    }
  },

  computed: {
    albumUrl() {
      if (this.album) {
        const artist = encodeURIComponent(
          this.album.artist.split(" ").join("-")
        );
        const album = encodeURIComponent(this.album.album.split(" ").join("-"));
        return `/library/albums/${this.album.id}/${artist}/${album}`;
      }
      return undefined;
    }
  },
  methods: {
    ...mapActions("album", ["getCoverArt"]),

    getArt() {
      if (this.album.coverArt) {
        this.getCoverArt({ id: this.album.coverArt }).then(cover => {
          this.cover = window.URL.createObjectURL(cover);
        });
      }
    }
  },
  watch: {
    album: function(val) {
      if (val) {
        this.getArt();
      }
    }
  }
};
</script>
