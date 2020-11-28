<template>
  <div class="d-flex flex-row align-content-stretch">
    <v-spacer></v-spacer>

    <v-card class="queueCard" elevation="4">
      <v-card-title class="headline"
        ><span>Current queue</span>
        <v-spacer></v-spacer>
        <v-btn text @click="onClear()">Clear</v-btn>
        <v-s-save-playlist :songs="playlist" label="Save"></v-s-save-playlist>
      </v-card-title>

      <v-s-songlist
        :elevation="0"
        :songs="playlist"
        dense
        full
        numbering="none"
      ></v-s-songlist>
    </v-card>
  </div>
</template>

<script lang="ts">
import VSSonglist from "@/components/Songlist.vue";
import VSSavePlaylist from "@/components/SavePlaylist.vue";
import { Component, Vue } from "vue-property-decorator";
import { stream } from "@/store/modules/stream";

@Component({
  name: "VSQueueList",
  components: { VSSavePlaylist, VSSonglist },
})
export default class QueueList extends Vue {
  @stream.State playlist;

  @stream.Mutation setPlaylist;

  onClear(): void {
    this.setPlaylist({ playlist: [], resetHistory: true });
  }
}
</script>

<style scoped>
.queueCard {
  width: 740px;
  max-width: 100vw;
}
</style>
