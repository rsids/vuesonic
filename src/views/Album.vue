<template>
  <div>
    <v-container v-if="currentAlbum">
      <div class="d-flex mb-8">
        <v-s-cover type="artist" :size="160" :entity="currentAlbum"></v-s-cover>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="album-title" v-text="currentAlbum.name"></span>
            <v-btn fab small outlined color="dark-grey"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <h2
            class="subtitle-1"
            v-text="currentAlbum.artist"
            @click="gotoArtist()"
          ></h2>
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn class="d-block btn-shuffle" text>
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
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

export default {
  name: "Album",
  components: { VSCover, VSSonglist, VSEmptyState },
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
    ...mapMutations("album", [SET_ALBUM]),

    gotoArtist() {
      const artist = encodeURIComponent(
        this.currentAlbum.artist.split(" ").join("-")
      );

      this.$router.push(
        `/library/artists/${this.currentAlbum.artistId}/${artist}`
      );
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
