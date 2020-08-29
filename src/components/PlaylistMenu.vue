<template>
  <v-menu
    bottom
    right
    open-on-hover
    offset-x
    close-on-click
    close-on-content-click
  >
    <template v-slot:activator="{ on, attrs2 }">
      <v-list-item v-bind="attrs2" v-on="on" @mouseover="triggerGetPlaylists()">
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
</template>

<script>
import Song from "@/store/interfaces/song";
import { mapActions, mapState } from "vuex";

export default {
  name: "VSPlaylistMenu",
  props: {
    song: Song
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
    ...mapActions("playlist", ["getPlaylists", "updatePlaylist"]),

    addToNewPlaylist(item) {
      // eslint-disable-next-line no-console
      console.log("Add to new playlist:", item);
    },
    addToPlaylist(playlist) {
      this.updatePlaylist({
        playlistId: playlist.id,
        songsToAdd: [this.song]
      }).then(() => {
        this.$dialog.message.info("1 song added to playlist", {
          position: "bottom-left"
        });
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
