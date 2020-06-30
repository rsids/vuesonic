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
        <span v-if="!!song" class="progress-text caption">
          <span v-text="progressFormatted"></span> /
          <span v-text="song.durationFormatted"></span>
        </span>
        <div>
          <div v-if="!!song" class="d-flex align-center">
            <v-s-cover :size="90" type="album" :entity="song"></v-s-cover>
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
          <v-btn icon @click="skipPrev()"
            ><v-icon>mdi-skip-previous</v-icon></v-btn
          >
          <v-btn fab :disabled="!song" @click="togglePlay()" color="primary">
            <v-icon v-if="!playing">mdi-play</v-icon>
            <v-icon v-if="playing">mdi-pause</v-icon>
          </v-btn>
          <v-btn icon @click="skipNext()"><v-icon>mdi-skip-next</v-icon></v-btn>
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
import { PAUSE, PLAY, SEEK } from "@/store/modules/stream";
import { duration } from "@/utils/generic";
import VSCover from "@/components/Cover";

export default {
  name: "VSPlayer",
  components: { VSCover },
  data() {
    return {
      seeking: false,
      songProgress: 0
    };
  },
  methods: {
    ...mapActions("stream", ["next", "prev"]),
    ...mapMutations("stream", [PLAY, PAUSE, SEEK]),

    changePlayhead($event) {
      this.seeking = false;
      this[SEEK]($event);
    },
    startSeeking() {
      this.seeking = true;
    },

    skipNext() {
      this.next();
    },

    skipPrev() {
      this.prev();
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

    progressFormatted() {
      return duration(this.songProgress);
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
  z-index: 1;
}
.progress-text {
  position: absolute;
  top: 4px;
  right: 8px;
  text-align: right;
}
</style>
