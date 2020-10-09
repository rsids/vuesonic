import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import { Song } from "@/store/interfaces/song";
import { shuffle } from "@/utils/generic";

export const PAUSE = "mutatePause";
export const PLAY = "mutatePlay";
export const PREV = "mutatePrev";
export const NEXT = "mutateNext";
export const HAS_PREV = "mutateHasPrev";
export const HAS_NEXT = "mutateHasNext";
export const REPEAT = "mutateRepeat";
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
  hasNext: boolean;
  hasPrev: boolean;
  song?: Song;
  repeat: boolean;
  paused: boolean;
  progress: number;
  playmode: number;
  playlist: Song[];
  history: Song[];
}

const state: StreamState = {
  audio: document.createElement("audio"),
  hasNext: false,
  hasPrev: false,
  history: [],
  paused: true,
  progress: 0,
  playmode: -1,
  playlist: [],
  repeat: false,
  song: undefined
};

const mutations = {
  [HAS_NEXT](state: StreamState, has) {
    state.hasNext = has;
  },
  [HAS_PREV](state: StreamState, has) {
    state.hasPrev = has;
  },
  [REPEAT](state: StreamState, repeat) {
    state.repeat = repeat;
  },
  [SONG](state, song: Song) {
    state.song = song;

    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album
      });
    }
    state.progress = 0;
    document.title = `${song.artist} - ${song.title} // VueSonic`;
  },
  [PAUSE](state: StreamState) {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "paused";
    }
    state.paused = true;
    state.audio.pause();
  },
  [PLAY](state: StreamState) {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "playing";
    }
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
  addToQueue({ state, commit }, { songs }) {
    commit(PLAYLIST, {
      playlist: [...state.playlist, songs],
      resetHistory: false
    });
  },

  init({ state, dispatch, commit }) {
    state.audio.addEventListener("timeupdate", () => {
      state.progress = state.audio.currentTime;
    });
    state.audio.addEventListener("ended", () => {
      dispatch("next");
    });

    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.setActionHandler("previoustrack", () => {
        dispatch("prev");
      });
      window.navigator.mediaSession.setActionHandler("nexttrack", () => {
        dispatch("next");
      });
      window.navigator.mediaSession.setActionHandler("play", () => {
        commit(PLAY);
      });

      window.navigator.mediaSession.setActionHandler("pause", () => {
        commit(PAUSE);
      });
    }
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
        const idx = state.playlist.findIndex(s => s.id === song.id);
        commit(HAS_NEXT, idx + 1 !== state.playlist.length || state.repeat);
        commit(HAS_PREV, idx > 0);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    });
  },

  next({ state, dispatch }) {
    if (state.playlist && state.song) {
      let idx = state.playlist.findIndex(song => song.id === state.song.id);
      if (idx >= 0 && idx < state.playlist.length - 1) {
        idx++;
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
  },

  shuffleAndPlay({ state, commit, dispatch }, { songs }) {
    commit(PLAYLIST, { playlist: shuffle(songs) });
    dispatch("play", { song: state.playlist[0] });
  }
};
export const stream: Module<StreamState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
