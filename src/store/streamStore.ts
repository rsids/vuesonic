import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import { Song } from "@/store/interfaces/song";

export const PAUSE = "mutatePause";
export const PLAY = "mutatePlay";
export const PREV = "mutatePrev";
export const NEXT = "mutateNext";
export const SEEK = "mutateSeek";
export const SONG = "mutateSong";
export const PLAYLIST = "mutatePlaylist";

export const PLAYMODE = {
  ALBUM: 0,
  PLAYLIST: 1,
  SEARCH: 2
};

// const audioContext = new AudioContext();
interface StreamState {
  audio: HTMLAudioElement;
  song?: Song;
  paused: boolean;
  progress: number;
  playmode: number;
  playlist: Song[];
  history: Song[];
}

const state: StreamState = {
  audio: new Audio(),
  song: undefined,
  paused: true,
  progress: 0,
  playmode: -1,
  playlist: [],
  history: []
};

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
  },
  [PLAYLIST](state: StreamState, playlist: Song[]) {
    state.history = [];
    state.playlist = [...playlist];
  }
};

const actions = {
  init({ state, dispatch }) {
    state.audio.addEventListener("timeupdate", () => {
      state.progress = state.audio.currentTime;
    });
    state.audio.addEventListener("ended", () => {
      dispatch("next");
    });
  },
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
  },
  next({ state, dispatch }) {
    if (state.playlist && state.song) {
      let idx = state.playlist.findIndex(song => song.id === state.song.id);
      if (idx >= 0) {
        idx++;
        idx = idx < state.playlist.length ? idx : 0;
        dispatch("play", { song: state.playlist[idx] });
      }
    }
  },
  prev({ state, dispatch }) {
    if (state.playlist && state.song) {
      let idx = state.playlist.findIndex(song => song.id === state.song.id);
      if (idx >= 0) {
        idx--;
        idx = idx < 0 ? state.playlist.length - 1 : idx;
        dispatch("play", { song: state.playlist[idx] });
      }
    }
  }
};
export const stream: Module<StreamState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
