<template>
  <div>
    <v-container v-if="currentPlaylist">
      <v-row align-content="center">
        <v-col cols="2">
          <v-img max-width="200" max-height="200" :src="cover"></v-img>
        </v-col>
        <v-col cols="10">
          <h1 class="title">
            <span class="album-title" v-text="currentPlaylist.name"></span>
            <v-btn fab small outlined color="dark-grey" @click="playIt()"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <!--          <h2 class="subtitle-1" v-text="currentAlbum.artist"></h2>-->
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn class="d-block btn-shuffle" text>
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            :songs="currentPlaylist.entry"
            :full="true"
            :numbering="'index'"
          ></v-s-songlist>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Playlist not found"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import VSEmptyState from "@/components/EmptyState";
import { duration } from "@/utils/generic";
import VSSonglist from "@/components/Songlist";
import { PLAYLIST } from "@/store/streamStore";

export default {
  name: "Playlist",
  components: { VSSonglist, VSEmptyState },
  data() {
    return {
      cover: "",
      notFound: false
    };
  },
  computed: {
    ...mapState("playlist", ["currentPlaylist"]),
    metaData() {
      const data = [];
      if (this?.currentPlaylist.songCount) {
        data.push(`${this.currentPlaylist.songCount} songs`);
      }
      if (this?.currentPlaylist.duration) {
        data.push(duration(this.currentPlaylist.duration));
      }
      return data.join(" • ");
    }
  },
  mounted() {
    this.getPlaylist(this.$route.params).then(
      playlist => {
        if (playlist.coverArt) {
          this.getCoverArt({ id: playlist.coverArt }).then(cover => {
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
    ...mapActions("album", ["getCoverArt"]),
    ...mapActions("playlist", ["getPlaylist"]),
    ...mapMutations("stream", [PLAYLIST]),
    ...mapActions("stream", ["play"]),

    playIt() {
      this[PLAYLIST](this.currentPlaylist.entry);
      this.play({ song: this.currentPlaylist.entry[0] });
    }
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
