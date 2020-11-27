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

<script>
import VSSonglist from "@/components/Songlist";
import { mapMutations, mapState } from "vuex";
import VSSavePlaylist from "@/components/SavePlaylist";

export default {
  name: "VSQueueList",
  components: { VSSavePlaylist, VSSonglist },

  computed: {
    ...mapState("stream", ["playlist"]),
  },

  methods: {
    ...mapMutations("stream", ["setPlaylist"]),
    onClear() {
      this.setPlaylist({ playlist: [], resetHistory: true });
    },
  },
};
</script>

<style scoped>
.queueCard {
  width: 740px;
  max-width: 100vw;
}
</style>
