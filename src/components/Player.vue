<template>
  <v-footer fixed height="90" elevation="4" padless>
    <v-container fluid class="footer-container">
      <v-row align="center" justify="space-between" class="player-row">
        <v-slider
          class="progress-slider"
          v-if="!!song"
          :value="playhead"
          @change="changePlayhead($event)"
          @mousedown="startSeeking()"
          min="0"
          step="0.1"
          :max="song.duration"
        ></v-slider>
        <div>
          <div v-if="!!song" class="d-flex align-center">
            <v-img
              aspect-ratio="1"
              max-width="90"
              width="90"
              max-height="90"
              height="90"
              :src="cover"
            ></v-img>
            <div class="ma-3">
              <div v-text="song.title" class="body-1 font-weight-medium"></div>
              <div class="body-2">
                <span v-text="song.artist"></span> -
                <span v-text="song.album"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="player-main-controls">
          <v-btn icon><v-icon>mdi-repeat</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-skip-previous</v-icon></v-btn>
          <v-btn fab :disabled="!song" @click="togglePlay()" color="primary">
            <v-icon v-if="!playing">mdi-play</v-icon>
            <v-icon v-if="playing">mdi-pause</v-icon>
          </v-btn>
          <v-btn icon><v-icon>mdi-skip-next</v-icon></v-btn>
          <v-btn icon color="#ff6600"><v-icon>mdi-shuffle</v-icon></v-btn>
        </div>
        <div>
          <v-btn icon><v-icon>mdi-volume-high</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-playlist-music</v-icon></v-btn>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { PAUSE, PLAY, SEEK } from "@/store/streamStore";

export default {
  name: "VSPlayer",
  data() {
    return {
      cover: "",
      seeking: false,
      songProgress: 0
    };
  },
  methods: {
    ...mapActions("album", ["getCoverArt"]),
    ...mapMutations("stream", [PLAY, PAUSE, SEEK]),

    changePlayhead($event) {
      this.seeking = false;
      this[SEEK]($event);
    },
    startSeeking() {
      this.seeking = true;
    },

    togglePlay() {
      this.playing = !this.playing;
    }
  },
  computed: {
    ...mapState("stream", ["song", "paused", "progress"]),

    playhead: {
      get() {
        return this.songProgress;
      },
      set(val) {
        this.songProgress = val;
      }
    },

    playing: {
      get() {
        return !this.paused;
      },
      set(val) {
        val ? this[PLAY]() : this[PAUSE]();
      }
    }
  },
  watch: {
    song: function(val) {
      if (val) {
        this.getCoverArt({ id: this.song.coverArt }).then(cover => {
          this.cover = window.URL.createObjectURL(cover);
        });
      }
    },
    progress: function(val) {
      if (!this.seeking) {
        this.songProgress = val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-container {
  padding-bottom: 0;
  padding-top: 0;
}

.player-main-controls {
  .v-btn:not(:last-child) {
    margin-right: 12px;
  }
}

.player-row {
  position: relative;
}
.progress-slider {
  position: absolute;
  left: 82px;
  right: -8px;
  top: -15px;
}
</style>
