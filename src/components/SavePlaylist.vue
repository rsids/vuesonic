<template>
  <v-btn text @click="saveAsPlaylist()">{{ label }}</v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Song } from "@/store/interfaces/song";

const playlist = namespace("playlist");
@Component({
  name: "VSSavePlaylist",
})
export default class SavePlaylist extends Vue {
  @Prop() label!: string;
  @Prop() songs!: Song[];

  @playlist.Action createPlaylist;
  async saveAsPlaylist(): Promise<string> {
    const name = await this.$dialog.prompt({
      text: "Save as",
      title: "Enter the name of the playlist",
    });
    if (name) {
      this.createPlaylist({ title: name, songs: this.songs }).then(() => {
        this.$router.push({ name: "playlists" });
        this.$emit("playlist-create");
      });
    }
    return name;
  }
}
</script>

<style scoped></style>
