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
import { Component, Prop, Vue } from "vue-property-decorator";
import { Song } from "@/store/interfaces/song";
import { stream } from "@/store/modules/stream";

@Component({
  name: "VSQueueMenu",
})
export default class QueueMenu extends Vue {
  @Prop() songs!: Song[];
  @Prop() type!: string;

  @stream.Action playNext!: (_) => void;
  @stream.Action addToQueue!: (_) => void;

  get itemtype(): string {
    if (this.type === "album") {
      return "album";
    }
    return "";
  }

  addToPlayingNext(): void {
    this.playNext({ songs: this.songs });
  }

  addItemToQueue(): void {
    this.addToQueue({ songs: this.songs });
  }
}
</script>
