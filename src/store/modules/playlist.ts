import { RootState } from "@/store/RootState";
import { Module } from "vuex";
import { Playlist } from "@/store/interfaces/playlist";
import { duration } from "@/utils/generic";
import { Song } from "@/store/interfaces/song";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";
import { $axios } from "@/plugins/axios";

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
    if (state.currentPlaylist) {
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
  getPlaylists({ commit }) {
    return $axios
      .get<any, SubsonicResponse>(`getPlaylists`)
      .then((response: SubsonicResponse) => {
        commit(PLAYLISTS, response.playlists?.playlist);
      });
  },
  getPlaylist({ commit }, { id }) {
    return $axios
      .get<any, SubsonicResponse>(`getPlaylist?id=${id}`)
      .then((response: SubsonicResponse) => {
        if (response.playlist) {
          response.playlist.entry = response.playlist?.entry.map(song => {
            song.durationFormatted = duration(song.duration);
            song.starred = !!song.starred;
            return song;
          });
        }
        commit(PLAYLIST, response.playlist);
        return response.playlist;
      });
  }

  // unstar(ctx, { id }) {
  //   return $axios
  //     .get(`getMusicDirectory?id=${id}`)
  //     .then((response: SubsonicResponse) => {
  //       // eslint-disable-next-line no-console
  //       return actions.getPlaylist(ctx, {
  //         id: response?.directory?.child[0].playlistId
  //       });
  //     });
  // }
};

export const playlist: Module<PlaylistState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
