<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="playlists">
        <v-s-playlist-card
          :playlist="playlist"
          v-for="(playlist, i) in playlists"
          :key="i"
        ></v-s-playlist-card>
      </v-row>

      <v-s-empty-state
        v-if="playlists && playlists.length === 0"
        icon="mdi-playlist-music"
        description="No playlists found!"
      ></v-s-empty-state>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSPlaylistCard from "@/components/PlaylistCard";
import VSEmptyState from "@/components/EmptyState";

export default {
  name: "Playlists",
  components: { VSEmptyState, VSPlaylistCard },
  data() {
    return {};
  },
  mounted() {
    this.getPlaylists();
  },

  computed: {
    ...mapState("playlist", ["playlists"])
  },
  methods: {
    ...mapActions("playlist", ["getPlaylists"])
  }
};
</script>
