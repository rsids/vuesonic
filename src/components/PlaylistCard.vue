<template>
  <v-card :to="playlistUrl" class="ma-3" max-width="200px" width="200px">
    <v-s-cover type="playlist" :size="200" :entity="playlist"></v-s-cover>
    <v-card-title class="subtitle-1">
      <div class="text-no-wrap text-truncate" v-text="playlist.name"></div>
    </v-card-title>
    <v-card-subtitle>
      <div class="text-no-wrap text-truncate">playlist</div>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import VSCover from "@/components/Cover";

export default {
  name: "VSPlaylistCard",
  components: { VSCover },
  props: {
    playlist,
  },
  data() {
    return {
      cover: "",
    };
  },

  computed: {
    playlistUrl() {
      if (this.playlist) {
        const name = encodeURIComponent(
          this.playlist.name.split(" ").join("-")
        );
        return `/library/playlists/${this.playlist.id}/${name}`;
      }
      return undefined;
    },
  },
};
</script>
