<template>
  <div>
    <h4>Playlists</h4>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="playlists">
        <v-s-playlist-card
          :playlist="playlist"
          v-for="(playlist, i) in playlists"
          :key="i"
        ></v-s-playlist-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSPlaylistCard from "@/components/PlaylistCard";

export default {
  name: "Playlists",
  components: { VSPlaylistCard },
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
