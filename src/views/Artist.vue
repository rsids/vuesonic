<template>
  <div>
    <v-container v-if="currentArtist">
      <v-row align-content="center">
        <v-col cols="3">
          <v-s-cover
            type="artist"
            :size="160"
            :entity="currentArtist"
          ></v-s-cover>
        </v-col>
        <v-col cols="9">
          <h1 class="title">
            <span class="artist-title" v-text="currentArtist.name"></span>&nbsp;
            <v-btn fab small outlined color="dark-grey"
              ><v-icon>mdi-play</v-icon></v-btn
            >
          </h1>
          <h2 class="subtitle-1">
            <span v-text="currentArtist.albumCount"></span> albums
          </h2>
        </v-col>
      </v-row>
      <v-row align-content="start" justify="start" v-if="currentArtist.album">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in currentArtist.album"
          :key="i"
        ></v-s-album-card>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Artist not found"
      icon="mdi-person"
    ></v-s-empty-state>
  </div>
</template>

<script>
import VSEmptyState from "@/components/EmptyState";
import { mapActions, mapMutations, mapState } from "vuex";
import VSCover from "@/components/Cover";
import VSAlbumCard from "@/components/AlbumCard";
import { noop } from "@/utils/generic";
import { SET_ARTIST } from "@/store/modules/artist";
export default {
  name: "Artist",
  components: { VSAlbumCard, VSCover, VSEmptyState },
  data() {
    return {
      cover: "",
      notFound: false
    };
  },
  mounted() {
    this.getArtist(this.$route.params).then(noop, err => {
      if (err.error.code === 70) {
        // 404
        this.notFound = true;
      }
    });
  },
  destroyed() {
    this[SET_ARTIST](null);
  },
  methods: {
    ...mapActions("artist", ["getArtist"]),
    ...mapMutations("artist", [SET_ARTIST])
  },
  computed: {
    ...mapState("artist", ["currentArtist"]),

    metaData() {
      return "";
    }
  }
};
</script>
