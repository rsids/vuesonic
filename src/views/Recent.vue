<template>
  <v-container fluid>
    <h2>Recently played or added</h2>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="recents">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in recents"
          :key="i"
        ></v-s-album-card>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import VSAlbumCard from "@/components/AlbumCard.vue";
import { noop } from "@/utils/generic";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const album = namespace("album");

@Component({
  name: "VSRecent",
  components: { VSAlbumCard },
})
export default class Recent extends Vue {
  @album.State recents;
  @album.Action getRecents;

  mounted(): void {
    this.getRecents().then(noop);
  }
}
</script>
