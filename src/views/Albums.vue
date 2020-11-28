<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="albums">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in albums"
          :key="i"
        ></v-s-album-card>
        <div v-intersect="onIntersect" style="visibility: hidden">
          INTERSECTOR
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import VSAlbumCard from "@/components/AlbumCard.vue";
import { Component, Vue } from "vue-property-decorator";
import { album } from "@/store/modules/album";
import { Album as IAlbum } from "@/store/interfaces/album";

@Component({
  name: "Albums",
  components: { VSAlbumCard },
})
export default class Albums extends Vue {
  @album.Action getAlbums!: (_) => Promise<IAlbum>;

  @album.State albums!: IAlbum[];

  loading = true;

  mounted(): void {
    if (this.albums.length === 0) {
      this.getAlbumSet();
    } else {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }

  getAlbumSet(): void {
    this.loading = true;
    this.getAlbums({ start: this.albums.length }).then(() => {
      this.loading = false;
    });
  }

  onIntersect(
    _entries: unknown,
    _observer: IntersectionObserver,
    isIntersecting: boolean
  ): void {
    if (!this.loading && isIntersecting) {
      this.getAlbumSet();
    }
  }
}
</script>
