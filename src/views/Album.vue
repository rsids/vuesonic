<template>
  <div>
    <v-container v-if="currentAlbum">
      <v-row align-content="center">
        <v-col cols="2">
          <v-img max-width="200" max-height="200" :src="cover"></v-img>
        </v-col>
        <v-col cols="10">
          <h1 class="title">
            <span class="album-title" v-text="currentAlbum.name"></span>
            <v-btn fab small outlined color="dark-grey"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <h2 class="subtitle-1" v-text="currentAlbum.artist"></h2>
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn class="d-block btn-shuffle" text>
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-s-songlist :songs="currentAlbum.song"></v-s-songlist>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Album not found"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSEmptyState from "@/components/EmptyState";
import { duration } from "@/utils/generic";
import VSSonglist from "@/components/Songlist";

export default {
  name: "Album",
  components: { VSSonglist, VSEmptyState },
  data() {
    return {
      cover: "",
      notFound: false
    };
  },
  computed: {
    ...mapState("album", ["currentAlbum"]),
    metaData() {
      const data = [];
      if (this?.currentAlbum.year) {
        data.push(this.currentAlbum.year);
      }
      if (this?.currentAlbum.songCount) {
        data.push(`${this.currentAlbum.songCount} songs`);
      }
      if (this?.currentAlbum.duration) {
        data.push(duration(this.currentAlbum.duration));
      }
      if (this?.currentAlbum.genre) {
        data.push(this.currentAlbum.genre);
      }
      return data.join(" • ");
    }
  },
  mounted() {
    this.getAlbumFromMusicDirectory(this.$route.params).then(
      album => {
        if (album.coverArt) {
          this.getCoverArt({ id: album.coverArt }).then(cover => {
            this.cover = window.URL.createObjectURL(cover);
          });
        }
      },
      err => {
        if (err.error.code === 70) {
          // 404
          this.notFound = true;
        }
      }
    );
  },
  methods: {
    ...mapActions("album", ["getAlbumFromMusicDirectory", "getCoverArt"])
  }
};
</script>

<style scoped lang="scss">
.btn-shuffle {
  padding-left: 0 !important;
  .v-icon {
    padding-right: 8px;
  }
}
.album-title {
  display: inline-block;
  padding-right: 16px;
}
</style>
