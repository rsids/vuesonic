<template>
  <div
    class="cover-container"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <intersect @enter="loadCover()">
      <div>
        <v-icon :size="size" v-if="cover === ''" class="no-cover"
          >{{ icon }}
        </v-icon>
        <v-img
          v-if="cover !== ''"
          aspect-ratio="1"
          :max-width="size"
          :width="size"
          :max-height="size"
          :height="size"
          :src="cover"
        ></v-img>
      </div>
    </intersect>
    <v-btn
      small
      class="btn--play"
      fab
      v-if="hover && type !== 'artist'"
      @click.stop="playIt()"
      ><v-icon>mdi-play</v-icon></v-btn
    >
  </div>
</template>

<script>
import Intersect from "vue-intersect";
import { mapActions, mapMutations } from "vuex";
import { PLAYLIST } from "@/store/modules/stream";

export default {
  name: "VSCover",
  components: { Intersect },
  data() {
    return {
      cover: "",
      hover: false,
      request: null,
      requested: false
    };
  },
  props: {
    size: Number,
    entity: Object,
    type: String
  },
  computed: {
    icon() {
      if (this.type === "artist") {
        return "mdi-account";
      } else if (this.type === "album") {
        return "mdi-album";
      }
      return "mdi-playlist";
    }
  },
  methods: {
    ...mapActions("album", ["getCoverArt", "getAlbumFromMusicDirectory"]),
    ...mapActions("stream", ["play"]),
    ...mapMutations("stream", [PLAYLIST]),

    playIt() {
      if (this.type === "album") {
        this.getAlbumFromMusicDirectory(this.entity).then(album => {
          this[PLAYLIST](album.song);
          this.play({ song: album.song[0] });
        });
      }
    },
    loadCover() {
      if (!this.requested) {
        this.requested = true;
        this.getCover();
      }
    },
    getCover() {
      if (
        this.requested &&
        this.entity &&
        this.entity.coverArt &&
        this.entity.coverArt !== ""
      ) {
        this.getCoverArt({ id: this.entity.coverArt }).then(cover => {
          this.cover = window.URL.createObjectURL(cover);
        });
      } else {
        this.cover = "";
      }
    }
  },
  watch: {
    entity: {
      immediate: true,
      handler: function() {
        this.getCover();
      }
    }
  }
};
</script>

<style scoped>
.no-cover {
  background: #eeeeee;
}
.cover-container {
  position: relative;
}
.btn--play {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
