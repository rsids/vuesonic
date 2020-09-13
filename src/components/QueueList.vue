<template>
  <div class="d-flex flex-row align-content-stretch">
    <v-spacer></v-spacer>
    <v-card class="queueCard" elevation="4">
      <v-card-title class="headline">Current queue</v-card-title>

      <v-s-songlist :songs="playlist" full dense :elevation="0"></v-s-songlist>
    </v-card>
  </div>
</template>

<script>
import VSSonglist from "@/components/Songlist";
import { mapState } from "vuex";
export default {
  name: "VSQueueList",
  components: { VSSonglist },

  computed: {
    ...mapState("stream", ["playlist"])
  }
};
</script>

<style scoped>
.queueCard {
  width: 600px;
  max-width: 100vw;
}
</style>
