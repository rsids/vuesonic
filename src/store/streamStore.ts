import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import { Song } from "@/store/interfaces/song";

export const PAUSE = "mutatePause";
export const PLAY = "mutatePlay";
export const SEEK = "mutateSeek";
export const SONG = "mutateSong";

// const audioContext = new AudioContext();
interface StreamState {
  audio: HTMLAudioElement;
  song?: Song;
  paused: boolean;
  progress: number;
}

const state: StreamState = {
  audio: new Audio(),
  song: undefined,
  paused: true,
  progress: 0
};

state.audio.addEventListener("playing", e => {
  // eslint-disable-next-line no-console
  console.log("Playing", e);
});
// state.audio.addEventListener("progress", (e: ProgressEvent) => {
//   // eslint-disable-next-line no-console
//   console.log("progress", e.timeStamp);
// });
state.audio.addEventListener("timeupdate", () => {
  state.progress = state.audio.currentTime;
});

const mutations = {
  [SONG](state, song) {
    state.song = song;
    state.progress = 0;
  },
  [PAUSE](state: StreamState) {
    state.paused = true;
    state.audio.pause();
  },
  [PLAY](state: StreamState) {
    state.paused = false;
    state.audio.play();
  },
  [SEEK](state: StreamState, seek) {
    state.audio.currentTime = seek;
  }
};

const actions = {
  play({ dispatch, commit, state }, { song }) {
    commit(PAUSE);
    dispatch(
      "connection/getUrl",
      { url: `stream?id=${song.id}` },
      { root: true }
    ).then(url => {
      state.audio.src = url;
      try {
        commit(SONG, song);
        commit(PLAY);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    });
  }
};
export const stream: Module<StreamState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
