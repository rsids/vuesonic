import qs from "qs";
import { Playlist } from "@/store/interfaces/playlist";
import { duration } from "@/utils/generic";
import { Song } from "@/store/interfaces/song";
import {
  PlaylistResponse,
  PlaylistsResponse
} from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import { UpdatePlaylistParams } from "@/store/interfaces/updatePlaylistParams";
import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from "vuex-module-decorators";

@Module({ namespaced: true })
export default class PlaylistStore extends VuexModule {
  playlists: Playlist[] = [];
  currentPlaylist!: Playlist;

  @Mutation
  updateStar({ id, toggle }) {
    if (this.currentPlaylist?.entry) {
      if (id) {
        this.currentPlaylist.entry = this.currentPlaylist.entry.map(
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

  @Action
  async createPlaylist({ title, songs }) {
    const result = Vue.prototype.axios.get(`createPlaylist`, {
      params: {
        name: title,
        songId: songs.map(song => song.id)
      },
      paramsSerializer: params => qs.stringify(params, { indices: false })
    });
    if (result.status === "ok") {
      await this.getPlaylists();
    }
  }

  @MutationAction
  async deletePlaylist({ id }) {
    await Vue.prototype.axios.get(`deletePlaylist?id=${id}`);
    return { playlists: [] as Playlist[] };
  }

  @MutationAction
  async getPlaylists() {
    const response: PlaylistsResponse = await Vue.prototype.axios.get(
      `getPlaylists`
    );
    return { playlists: response.playlists.playlist || [] };
  }

  @MutationAction
  async getPlaylist({ id }) {
    const response: PlaylistResponse = await Vue.prototype.axios.get(
      `getPlaylist?id=${id}`
    );
    if (response.playlist) {
      response.playlist.entry = response.playlist?.entry?.map(song => {
        song.durationFormatted = duration(song.duration);
        song.starred = !!song.starred;
        return song;
      });
      return { currentPlaylist: response.playlist };
    }
    return { currentPlaylist: null };
  }

  @Action
  async updatePlaylist(params: UpdatePlaylistParams) {
    const getParams = { ...params };
    getParams.songIdToAdd = getParams.songsToAdd?.map(song => song.id);
    delete getParams.songsToAdd;

    await Vue.prototype.axios.get("updatePlaylist", {
      params: getParams,
      paramsSerializer: params => qs.stringify(params, { indices: false })
    });

    if (this.currentPlaylist?.id === params.playlistId) {
      await this.getPlaylist(this.currentPlaylist);
    }
  }
}
