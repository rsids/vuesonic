<template>
  <div>
    <v-menu
      bottom
      right
      open-on-hover
      offset-x
      close-on-click
      close-on-content-click
    >
      <template v-slot:activator="{ on, attrs2 }">
        <v-list-item
          v-bind="attrs2"
          v-on="on"
          @mouseover="triggerGetPlaylists()"
        >
          <v-list-item-title>Add to playlist</v-list-item-title>
          <v-btn icon>
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <v-list>
        <v-list-item @click="addToNewPlaylist()">
          <v-list-item-title>New Playlist</v-list-item-title>
        </v-list-item>
        <v-divider v-if="playlists && playlists.length > 0"></v-divider>
        <v-list-item
          v-for="(playlist, index) in playlists"
          :key="index"
          @click="addToPlaylist(playlist)"
        >
          <v-list-item-title>{{ playlist.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "VSPlaylistMenu",
  props: {
    songs: Array
  },
  data() {
    return {
      fetchingPlaylists: false
    };
  },
  computed: {
    ...mapState("playlist", ["playlists"])
  },
  methods: {
    ...mapActions("playlist", [
      "createPlaylist",
      "getPlaylists",
      "updatePlaylist"
    ]),

    async addToNewPlaylist() {
      const title = await this.$dialog.prompt({
        title: "New Playlist",
        text: "Name",
        actions: {
          false: "Cancel",
          true: "Create playlist"
        }
      });
      this.createPlaylist({
        title: title,
        songs: this.songs
      }).then(() => {
        this.$dialog.message.info(
          `${this.songs.length} song(s) added to new playlist`,
          {
            position: "bottom-left"
          }
        );
      });
    },

    addToPlaylist(playlist) {
      this.updatePlaylist({
        playlistId: playlist.id,
        songsToAdd: this.songs
      }).then(() => {
        this.$dialog.message.info(
          `${this.songs.length} song(s) added to playlist`,
          {
            position: "bottom-left"
          }
        );
      });
    },

    triggerGetPlaylists() {
      if (!this.fetchingPlaylists) {
        this.fetchingPlaylists = true;
        this.getPlaylists();
      }
    }
  }
};
</script>
