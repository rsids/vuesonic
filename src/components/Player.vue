<template>
  <v-footer fixed height="90" elevation="4" padless>
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
    <div class="player">
      <div class="player__song">
        <span v-if="!!song" class="progress-text caption">
          <span v-text="progressFormatted"></span> /
          <span v-text="song.durationFormatted"></span>
        </span>
        <div>
          <div v-if="!!song" class="d-flex align-center">
            <v-s-cover :size="90" type="album" :entity="song"></v-s-cover>
            <div class="ma-3">
              <div
                v-text="song.title"
                class="body-1 font-weight-medium text-no-wrap text-truncate"
              ></div>
              <div class="body-2 text-no-wrap text-truncate">
                <span v-text="song.artist"></span> -
                <span v-text="song.album"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="player__controls">
        <v-btn icon><v-icon>mdi-repeat</v-icon></v-btn>
        <v-btn icon @click="skipPrev()"
          ><v-icon>mdi-skip-previous</v-icon></v-btn
        >
        <v-btn fab :disabled="!song" @click="togglePlay()" color="primary">
          <v-icon v-if="!playing">mdi-play</v-icon>
          <v-icon v-if="playing">mdi-pause</v-icon>
        </v-btn>
        <v-btn icon @click="skipNext()" :disabled="!hasNext"
          ><v-icon>mdi-skip-next</v-icon></v-btn
        >
        <v-btn icon color="#ff6600"><v-icon>mdi-shuffle</v-icon></v-btn>
      </div>
      <div class="player__sound">
        <v-btn icon><v-icon>mdi-volume-high</v-icon></v-btn>
        <v-btn icon @click.stop="queue = true"
          ><v-icon>mdi-playlist-music</v-icon></v-btn
        >
      </div>
    </div>
    <v-dialog content-class="queueList" origin="bottom right" v-model="queue">
      <v-s-queue-list></v-s-queue-list>
    </v-dialog>
  </v-footer>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { PAUSE, PLAY, SEEK } from "@/store/modules/stream";
import { duration } from "@/utils/generic";
import VSCover from "@/components/Cover";
import VSQueueList from "@/components/QueueList";

const PREV_MODE_PREV = 0;
const PREV_MODE_SEEK = 1;
export default {
  name: "VSPlayer",
  components: { VSQueueList, VSCover },
  data() {
    return {
      prevClick: 0,
      prevMode: PREV_MODE_PREV,
      queue: false,
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
      if (this.songProgress < 2 && this.prevMode === PREV_MODE_SEEK) {
        this[SEEK](0);
        this.prevMode = PREV_MODE_PREV;
        this.prevClick = setTimeout(() => {
          this.prevMode = PREV_MODE_SEEK;
        }, 1000);
      } else {
        this.prev();
      }
    },

    togglePlay() {
      this.playing = !this.playing;
    }
  },
  computed: {
    ...mapState("stream", ["song", "paused", "progress", "hasNext", "hasPrev"]),

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
    },

    song: function() {
      this.prevMode = PREV_MODE_SEEK;
    }
  }
};
</script>
<style lang="scss" scoped>
$playerWidth: 256px;
.footer-container {
  padding-bottom: 0;
  padding-top: 0;
}

.player {
  align-items: center;
  display: flex;
  width: 100vw;
}

.player__song {
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(50vw - #{$playerWidth / 2});
}

.player__controls {
  .v-btn:not(:last-child) {
    margin-right: 12px;
  }

  align-items: center;
  display: flex;
  flex-basis: $playerWidth;
  flex-shrink: 0;
  flex-grow: 0;
}

.player__sound {
  justify-content: flex-end;
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
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

<style lang="scss">
.queueList {
  align-self: flex-end;
  box-shadow: none;
  justify-self: end;
  margin-bottom: 100px;
}
</style>
