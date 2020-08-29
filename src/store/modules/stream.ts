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
export const ADD_TO_PLAYLIST = "mutateAddPlaylist";

export const PLAYMODE = {
  ALBUM: 0,
  PLAYLIST: 1,
  SEARCH: 2
};

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
  audio: document.createElement("audio"),
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
  [PLAYLIST](state: StreamState, { playlist, resetHistory = true }) {
    if (resetHistory) {
      state.history = [];
    }
    state.playlist = [...playlist];
  },
  [ADD_TO_PLAYLIST](state: StreamState, playlist: Song[]) {
    state.playlist = [...state.playlist, ...playlist];
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
  playNext({ state, dispatch, commit }, { songs }) {
    let idx = 0;
    if (state.song) {
      idx = state.playlist.indexOf(state.song) + 1;
    }
    const arr = [...state.playlist];
    arr.splice(idx, 0, ...songs);
    commit(PLAYLIST, { playlist: arr, resetHistory: false });
    if (!state.song) {
      dispatch("play", { song: state.playlist[0] });
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
