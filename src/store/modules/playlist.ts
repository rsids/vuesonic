import { RootState } from "@/store/RootState";
import { Module } from "vuex";
import qs from "qs";
import { Playlist } from "@/store/interfaces/playlist";
import { duration } from "@/utils/generic";
import { Song } from "@/store/interfaces/song";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import { UpdatePlaylistParams } from "@/store/interfaces/updatePlaylistParams";

const PLAYLISTS = "mutatePlaylists";
const PLAYLIST = "mutatePlaylist";
const UPDATE_STAR = "updateStar";

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist?: Playlist;
}

const state: PlaylistState = {
  playlists: [],
  currentPlaylist: undefined
};

const mutations = {
  [PLAYLISTS](state, playlists: Playlist[]) {
    state.playlists = playlists;
  },
  [PLAYLIST](state, playlist: Playlist) {
    state.currentPlaylist = playlist;
  },
  [UPDATE_STAR](state: PlaylistState, { id, toggle }) {
    if (state?.currentPlaylist?.entry) {
      if (id) {
        state.currentPlaylist.entry = state.currentPlaylist.entry.map(
          (song: Song) => {
            if (song.id === id) {
              song.starred = toggle;
            }
            return song;
          }
        );
      }
    }
  }
};

const actions = {
  createPlaylist({ dispatch }, { title, songs }) {
    return Vue.prototype.axios
      .get(`createPlaylist`, {
        params: {
          name: title,
          songId: songs.map(song => song.id)
        },
        paramsSerializer: params => qs.stringify(params, { indices: false })
      })
      .then(() => {
        dispatch("getPlaylists");
      });
  },

  deletePlaylist({ commit }, { id }) {
    return Vue.prototype.axios.get(`deletePlaylist?id=${id}`).then(() => {
      commit(PLAYLISTS, undefined);
    });
  },

  getPlaylists({ commit }) {
    return Vue.prototype.axios
      .get(`getPlaylists`)
      .then((response: SubsonicResponse) => {
        commit(PLAYLISTS, response.playlists?.playlist || []);
      });
  },

  getPlaylist({ commit }, { id }) {
    return Vue.prototype.axios
      .get(`getPlaylist?id=${id}`)
      .then((response: SubsonicResponse) => {
        if (response.playlist) {
          response.playlist.entry = response.playlist?.entry?.map(song => {
            song.durationFormatted = duration(song.duration);
            song.starred = !!song.starred;
            return song;
          });
        }
        commit(PLAYLIST, response.playlist);
        return response.playlist;
      });
  },

  updatePlaylist({ state, dispatch }, params: UpdatePlaylistParams) {
    const getParams = { ...params };
    getParams.songIdToAdd = getParams.songsToAdd?.map(song => song.id);
    delete getParams.songsToAdd;

    return Vue.prototype.axios
      .get("updatePlaylist", {
        params: getParams,
        paramsSerializer: params => qs.stringify(params, { indices: false })
      })
      .then(() => {
        if (state.currentPlaylist?.id === params.playlistId) {
          dispatch("getPlaylist", state.currentPlaylist);
        }
      });
  }
};

export const playlist: Module<PlaylistState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
