<template>
  <div>
    <v-container v-if="currentAlbum">
      <div class="d-flex mb-8">
        <v-s-cover type="artist" :size="160" :entity="currentAlbum"></v-s-cover>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="album-title" v-text="currentAlbum.name"></span>
            <v-btn fab small outlined color="dark-grey" @click="playAlbum()"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <h2
            class="subtitle-1"
            v-text="currentAlbum.artist"
            @click="gotoArtist()"
          ></h2>
          <span class="subtitle-2">{{ metaData }}</span>
          <div class="d-flex justify-lg-space-between">
            <v-btn class="d-block btn-shuffle" text @click="shuffleAlbum()">
              <v-icon>mdi-shuffle</v-icon>
              shuffle
            </v-btn>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-s-queue-menu
                  :songs="currentAlbum.song"
                  type="album"
                ></v-s-queue-menu>
                <v-divider></v-divider>
                <v-s-playlist-menu
                  :songs="currentAlbum.song"
                ></v-s-playlist-menu>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
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
import { mapActions, mapMutations, mapState } from "vuex";
import VSEmptyState from "@/components/EmptyState";
import { duration, noop } from "@/utils/generic";
import VSSonglist from "@/components/Songlist";
import VSCover from "@/components/Cover";
import { SET_ALBUM } from "@/store/modules/album";
import VSPlaylistMenu from "@/components/PlaylistMenu";
import VSQueueMenu from "@/components/QueueMenu";
import { PLAYLIST } from "@/store/modules/stream";

export default {
  name: "Album",
  components: {
    VSQueueMenu,
    VSPlaylistMenu,
    VSCover,
    VSSonglist,
    VSEmptyState
  },
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
    this.getAlbum(this.$route.params).then(noop, err => {
      if (err.error.code === 70) {
        // 404
        this.notFound = true;
      }
    });
  },
  destroyed() {
    this[SET_ALBUM](null);
  },
  methods: {
    ...mapActions("album", ["getAlbum", "getCoverArt"]),
    ...mapActions("stream", ["shuffleAndPlay", "play"]),
    ...mapMutations("album", [SET_ALBUM]),
    ...mapMutations("stream", [PLAYLIST]),

    gotoArtist() {
      const artist = encodeURIComponent(
        this.currentAlbum.artist.split(" ").join("-")
      );

      this.$router.push(
        `/library/artists/${this.currentAlbum.artistId}/${artist}`
      );
    },

    playAlbum() {
      this[PLAYLIST]({ playlist: this.currentAlbum.song });
      this.play({ song: this.currentAlbum.song[0] });
    },

    shuffleAlbum() {
      this.shuffleAndPlay({ songs: this.currentAlbum.song });
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
