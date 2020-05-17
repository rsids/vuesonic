<template>
  <div>
    <v-container v-if="album">
      <v-row align-content="center">
        <v-col cols="2">
          <v-img max-width="200" max-height="200" :src="cover"></v-img>
        </v-col>
        <v-col cols="10">
          <h1 class="title">
            <span class="album-title" v-text="album.name"></span>
            <v-btn fab small outlined color="dark-grey"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <h2 class="subtitle-1" v-text="album.artist"></h2>
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn class="d-block btn-shuffle" text>
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-s-songlist :songs="album.song"></v-s-songlist>
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
import { mapActions } from "vuex";
import VSEmptyState from "@/components/EmptyState";
import { duration } from "@/utils/generic";
import VSSonglist from "@/components/Songlist";

export default {
  name: "Album",
  components: { VSSonglist, VSEmptyState },
  data() {
    return {
      album: null,
      cover: "",
      notFound: false
    };
  },
  computed: {
    metaData() {
      const data = [];
      if (this?.album.year) {
        data.push(this.album.year);
      }
      if (this?.album.songCount) {
        data.push(`${this.album.songCount} songs`);
      }
      if (this?.album.duration) {
        data.push(duration(this.album.duration));
      }
      if (this?.album.genre) {
        data.push(this.album.genre);
      }
      return data.join(" • ");
    }
  },
  mounted() {
    this.getAlbumFromMusicDirectory(this.$route.params).then(
      album => {
        album.song = album.song.map(song => {
          song.durationFormatted = duration(song.duration);
          return song;
        });
        this.album = album;
        if (this.album.coverArt) {
          this.getCoverArt({ id: this.album.coverArt }).then(cover => {
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
