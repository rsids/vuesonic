<template>
  <div>
    <v-container v-if="currentArtist">
      <div class="d-flex mb-8">
        <v-s-cover
          :entity="currentArtist"
          :size="160"
          type="artist"
        ></v-s-cover>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="artist-title" v-text="currentArtist.name"></span>&nbsp;
            <!--            <v-btn fab small outlined color="dark-grey"-->
            <!--              ><v-icon>mdi-play</v-icon></v-btn-->
            <!--            >-->
            <!-- @todo implement play all albums -->
          </h1>
          <h2 class="subtitle-1">
            <span v-text="currentArtist.albumCount"></span> albums
          </h2>
        </div>
      </div>
      <v-row v-if="currentArtist.album" align-content="start" justify="start">
        <v-s-album-card
          v-for="(album, i) in currentArtist.album"
          :key="i"
          :album="album"
        ></v-s-album-card>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Artist not found"
      icon="mdi-person"
    ></v-s-empty-state>
  </div>
</template>

<script lang="ts">
import VSEmptyState from "@/components/EmptyState.vue";
import VSCover from "@/components/Cover.vue";
import VSAlbumCard from "@/components/AlbumCard.vue";
import { noop } from "@/utils/generic";
import { Component, Vue } from "vue-property-decorator";
import { artist } from "@/store/modules/artist";

@Component({
  name: "Artist",
  components: { VSAlbumCard, VSCover, VSEmptyState },
})
export default class Artist extends Vue {
  cover = "";
  notFound = false;

  @artist.Action getArtist!: (_) => Promise<Artist>;
  @artist.Mutation setArtist;
  @artist.State currentArtist;

  get metaData(): string {
    return "";
  }

  mounted(): void {
    this.getArtist(this.$route.params).then(noop, (err) => {
      if (err.error.code === 70) {
        // 404
        this.notFound = true;
      }
    });
  }
  destroyed(): void {
    this.setArtist(null);
  }
}
</script>
