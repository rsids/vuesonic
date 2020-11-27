<template>
  <div>
    <v-list-item @click="addToPlayingNext()">
      <v-list-item-title>Play {{ itemtype }} next</v-list-item-title>
    </v-list-item>
    <v-list-item @click="addItemToQueue()">
      <v-list-item-title>Add {{ itemtype }} to queue</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Song } from "@/store/interfaces/song";

@Component({
  name: "VSQueueMenu",
  ...mapActions("stream", ["playNext", "addToQueue"]),
})
export default class QueueMenu extends Vue {
  @Prop() songs!: Song[];
  @Prop() type!: string;

  playNext!: (s) => void;
  addToQueue!: (s) => void;

  itemtype() {
    if (this.type === "album") {
      return "album";
    }
    return "";
  }

  addToPlayingNext() {
    this.playNext({ songs: this.songs });
  }

  addItemToQueue() {
    this.addToQueue({ songs: this.songs });
  }
}
</script>
