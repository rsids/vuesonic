<template>
  <div class="artist" @click="gotoArtist()">
    <v-sheet class="artist__photo ma-4" elevation="4">
      <v-s-cover :entity="artist" type="artist" :size="160"></v-s-cover>
    </v-sheet>
    <span
      class="subtitle-1 text-no-wrap text-truncate"
      style="max-width: 160px"
      >{{ artist.name }}</span
    >
  </div>
</template>

<script lang="ts">
import VSCover from "@/components/Cover.vue";
import { getArtistUrl } from "@/utils/generic";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Artist } from "@/store/interfaces/artist";
import { album } from "@/store/modules/album";

@Component({
  name: "VSArtistCard",
  components: { VSCover },
})
export default class ArtistCard extends Vue {
  @Prop() artist!: Artist;

  @album.Action cancelAllRequests;

  get artistUrl(): string {
    return getArtistUrl(this.artist) || "";
  }
  gotoArtist(): void {
    this.cancelAllRequests();
    this.$router.push(this.artistUrl);
  }
}
</script>

<style scoped lang="scss">
.artist {
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  &__photo {
    border-radius: 80px 80px;
    border: 4px solid white;
    overflow: hidden;
    width: 160px;
    height: 160px;
  }
}
</style>
