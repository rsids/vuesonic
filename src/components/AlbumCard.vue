<template>
  <v-card
    class="ma-3 album-card"
    max-width="200px"
    width="200px"
    @click="gotoAlbum()"
  >
    <v-s-cover type="album" :size="200" :entity="album"></v-s-cover>
    <v-card-title class="subtitle-1">
      <div class="text-no-wrap text-truncate" v-text="albumName"></div>
    </v-card-title>
    <v-card-subtitle>
      <div class="text-no-wrap text-truncate" v-text="album.artist"></div>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { Album } from "@/store/interfaces/album";
import { mapActions } from "vuex";
import { Component, Prop, Provide, Vue } from "vue-property-decorator";
import { Cover } from "@/store/interfaces/cover";

@Component({
  methods: {
    ...mapActions("album", ["getAlbumFromMusicDirectory", "cancelAllRequests"])
  },
  name: "VSAlbumCard",
  components: { Cover }
})
export default class AlbumCard extends Vue {
  @Prop() album!: Album;
  @Provide() cover = "";
  cancelAllRequests!: () => void;
  getAlbumFromMusicDirectory!: (album: Album) => Promise<Album>;

  gotoAlbum() {
    this.cancelAllRequests();
    if (this.album.musicDirectory) {
      this.getAlbumFromMusicDirectory(this.album).then((album: Album) => {
        this.$router.push(this.getAlbumUrl(album.id));
      });
    } else {
      this.$router.push(this.getAlbumUrl(this.album.id));
    }
  }

  getAlbumUrl(id?: number): string {
    if (this.album && id) {
      const artist = encodeURIComponent(this.album.artist.split(" ").join("-"));
      const albumName = this.album.album || this.album.name;
      const album = encodeURIComponent(albumName.split(" ").join("-"));
      return `/library/albums/${id}/${artist}/${album}`.toLowerCase();
    }
    return "";
  }

  get albumName() {
    if (this.album.album) {
      return this.album.album;
    } else if (this.album.name) {
      return this.album.name;
    }
    return "";
  }
}
</script>
