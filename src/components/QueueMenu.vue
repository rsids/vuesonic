<template>
  <div>
    <v-list-item @click="addToPlayingNext()">
      <v-list-item-title>Play {{ itemtype }} next</v-list-item-title>
    </v-list-item>
    <v-list-item @click="addToQueue()">
      <v-list-item-title>Add {{ itemtype }} to queue</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
  name: "VSQueueMenu",
  props: {
    songs: Array,
    type: String,
  },
  computed: {
    itemtype(): string {
      if (this.type === "album") {
        return "album";
      }
      return "";
    },
  },
  methods: {
    ...mapActions("stream", ["playNext", "addToQueue"]),

    addToPlayingNext(): void {
      this.playNext({ songs: this.songs });
    },

    addToQueue(): void {
      this.addToQueue({ songs: this.songs });
    },
  },
};
</script>
