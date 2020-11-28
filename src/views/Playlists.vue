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

<script lang="ts">
import VSPlaylistCard from "@/components/PlaylistCard.vue";
import VSEmptyState from "@/components/EmptyState.vue";
import { Component, Vue } from "vue-property-decorator";
import { playlist } from "@/store/modules/playlist";
import { Playlist } from "@/store/interfaces/playlist";

@Component({
  name: "Playlists",
  components: { VSEmptyState, VSPlaylistCard },
})
export default class Playlists extends Vue {
  @playlist.Action getPlaylists;
  @playlist.State playlists!: Playlist[];

  mounted(): void {
    this.getPlaylists();
  }
}
</script>
