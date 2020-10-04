<template>
  <v-btn text @click="saveAsPlaylist()">{{ label }}</v-btn>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "VSSavePlaylist",
  props: ["label", "songs"],
  methods: {
    ...mapActions("playlist", ["createPlaylist"]),
    async saveAsPlaylist() {
      const name = await this.$dialog.prompt({
        text: "Save as",
        title: "Enter the name of the playlist"
      });
      if (name) {
        this.createPlaylist({ title: name, songs: this.songs }).then(() => {
          this.$router.push({ name: "playlists" });
          this.$emit("playlistCreate");
        });
      }
    }
  }
};
</script>

<style scoped></style>
