<template>
  <v-card class="ma-3" max-width="200px" width="200px" @click="gotoAlbum()">
    <v-s-cover type="album" :size="200" :entity="album"></v-s-cover>
    <v-card-title class="subtitle-1">
      <div class="text-no-wrap text-truncate" v-text="albumName"></div>
    </v-card-title>
    <v-card-subtitle>
      <div class="text-no-wrap text-truncate" v-text="album.artist"></div>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { Album } from "@/store/interfaces/album";
import VSCover from "@/components/Cover";

export default {
  name: "VSAlbumCard",
  components: { VSCover },
  props: {
    album: Album
  },
  data() {
    return {
      cover: ""
    };
  },

  methods: {
    gotoAlbum() {
      this.$router.push(this.albumUrl);
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
    },

    albumName() {
      if (this.album.album) {
        return this.album.album;
      } else if (this.album.name) {
        return this.album.name;
      }
      return "";
    }
  }
};
</script>
