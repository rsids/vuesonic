<template>
  <v-footer elevation="4" fixed height="90" padless>
    <v-slider
      v-if="!!song"
      :max="song.duration"
      :value="playhead"
      class="progress-slider"
      min="0"
      step="0.1"
      @change="changePlayhead($event)"
      @mousedown="startSeeking()"
    ></v-slider>
    <div class="player">
      <div class="player__song">
        <span v-if="!!song" class="progress-text caption">
          <span v-text="progressFormatted"></span> /
          <span v-text="song.durationFormatted"></span>
        </span>
        <div>
          <div v-if="!!song" class="d-flex align-center">
            <v-s-cover :entity="song" :size="90" type="album"></v-s-cover>
            <div class="ma-3">
              <div
                class="body-1 font-weight-medium text-no-wrap text-truncate"
                v-text="song.title"
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
        <v-btn icon>
          <v-icon>mdi-repeat</v-icon>
        </v-btn>
        <v-btn icon @click="skipPrev()">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn :disabled="!song" color="primary" fab @click="togglePlay()">
          <v-icon v-if="!playing">mdi-play</v-icon>
          <v-icon v-if="playing">mdi-pause</v-icon>
        </v-btn>
        <v-btn :disabled="!hasNext" icon @click="skipNext()">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-btn color="#ff6600" icon>
          <v-icon>mdi-shuffle</v-icon>
        </v-btn>
      </div>
      <div class="player__sound">
        <v-btn icon>
          <v-icon>mdi-volume-high</v-icon>
        </v-btn>
        <v-btn icon @click.stop="queue = true">
          <v-icon>mdi-playlist-music</v-icon>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="queue" content-class="queueList" origin="bottom right">
      <v-s-queue-list></v-s-queue-list>
    </v-dialog>
  </v-footer>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
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
    ...mapMutations("stream", ["setPlaying", "setPaused", "seek"]),

    changePlayhead($event) {
      this.seeking = false;
      this.seek($event);
    },
    startSeeking() {
      this.seeking = true;
    },

    skipNext() {
      this.next();
    },

    skipPrev() {
      if (this.songProgress < 2 && this.prevMode === PREV_MODE_SEEK) {
        this.seek(0);
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
        val ? this.setPlaying() : this.setPaused();
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
