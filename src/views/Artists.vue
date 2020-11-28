<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="artists">
        <v-s-artist-card
          v-for="(artist, i) in artists"
          :key="i"
          :artist="artist"
        ></v-s-artist-card>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import VSArtistCard from "@/components/ArtistCard.vue";
import { Component, Vue } from "vue-property-decorator";
import { artist } from "@/store/modules/artist";
import { Artist as IArtist } from "@/store/interfaces/artist";

@Component({
  name: "Artists",
  components: { VSArtistCard },
})
export default class Artist extends Vue {
  @artist.Action getArtists;

  @artist.State artists!: IArtist[];

  mounted(): void {
    this.getArtists();
  }
}
</script>
