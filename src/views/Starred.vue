<template>
  <div>
    <v-container v-if="starred && starred.length > 0">
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            :songs="starred"
            :full="true"
            :numbering="'index'"
          ></v-s-songlist>
          <v-s-save-playlist
            label="Save as playlist"
            :songs="starred"
          ></v-s-save-playlist>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="loaded && starred && starred.length === 0"
      description="No starred items!"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script lang="ts">
import VSSonglist from "@/components/Songlist.vue";
import VSSavePlaylist from "@/components/SavePlaylist.vue";
import { Component, Vue } from "vue-property-decorator";
import VSEmptyState from "@/components/EmptyState.vue";
import { album } from "@/store/modules/album";
import { Song } from "@/store/interfaces/song";

@Component({
  name: "Playlist",
  components: { VSSavePlaylist, VSSonglist, VSEmptyState },
})
export default class Starred extends Vue {
  @album.Action getStarred!: () => Promise<unknown>;

  @album.State starred!: Song[];

  cover = "";
  loaded = false;

  mounted(): void {
    this.getStarred().then(() => (this.loaded = true));
  }
}
</script>

<style scoped lang="scss">
.btn-shuffle {
  padding-left: 0 !important;
  .v-icon {
    padding-right: 8px;
  }
}
.album-title {
  display: inline-block;
  padding-right: 16px;
}
</style>
