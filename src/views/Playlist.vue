<template>
  <div>
    <v-container v-if="currentPlaylist">
      <div class="d-flex mb-8">
        <v-img max-width="160" max-height="160" :src="cover"></v-img>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="album-title" v-text="currentPlaylist.name"></span>
            <v-btn
              fab
              small
              outlined
              color="dark-grey"
              @click="playIt()"
              v-if="currentPlaylist.songCount > 0"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <!--          <h2 class="subtitle-1" v-text="currentAlbum.artist"></h2>-->
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn
            class="d-block btn-text-with-icon"
            text
            :disabled="currentPlaylist.songCount === 0"
          >
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
          <div class="d-flex flex-row">
            <v-btn class="d-block btn-text-with-icon" text>
              <v-icon>mdi-pencil</v-icon>
              edit
            </v-btn>
            <v-btn class="d-block btn-text-with-icon" text @click="deleteIt()">
              <v-icon>mdi-delete</v-icon>
              delete
            </v-btn>
          </div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            v-if="currentPlaylist.songCount > 0"
            :songs="currentPlaylist.entry"
            :full="true"
            :numbering="'index'"
          ></v-s-songlist>
          <v-s-empty-state
            v-if="currentPlaylist.songCount === 0"
            description="Your playlist is empty, add some songs to it!"
            icon="mdi-album"
          ></v-s-empty-state>
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
import { PLAYLIST } from "@/store/modules/stream";

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
        // eslint-disable-next-line no-console
        console.log("ERR STATE", err);
        if (err.error.code === 70) {
          // 404
          this.notFound = true;
        }
      }
    );
  },
  methods: {
    ...mapActions("album", ["getCoverArt"]),
    ...mapActions("playlist", ["getPlaylist", "deletePlaylist"]),
    ...mapMutations("stream", [PLAYLIST]),
    ...mapActions("stream", ["play"]),

    playIt() {
      this[PLAYLIST](this.currentPlaylist.entry);
      this.play({ song: this.currentPlaylist.entry[0] });
    },

    async deleteIt() {
      const res = await this.$dialog.confirm({
        text: "Are you sure you want to delete this playlist?",
        title: "Warning"
      });

      if (res) {
        this.deletePlaylist(this.currentPlaylist).then(() => {
          this.$router.push({ name: "playlists" });
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.btn-text-with-icon {
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
