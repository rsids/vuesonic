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

<script>
import { mapActions } from "vuex";

export default {
  name: "VSQueueMenu",
  props: {
    songs: Array,
    type: String
  },
  computed: {
    itemtype() {
      if (this.type === "album") {
        return "album";
      }
      return "";
    }
  },
  methods: {
    ...mapActions("stream", ["playNext", "addToQueue"]),

    addToPlayingNext() {
      this.playNext({ songs: this.songs });
    },

    addToQueue() {
      this.addToQueue({ songs: this.songs });
    }
  }
};
</script>
