<template>
  <v-data-table
    :hide-default-footer="true"
    class="elevation-1"
    @click:row="playSong($event)"
    :headers="headers"
    :items="songs"
  >
    <template #header.duration="">
      <v-icon size="medium">mdi-clock-time-four-outline</v-icon>
    </template>
    <template #header.playCount="">
      <v-icon size="medium">mdi-music-note</v-icon>
    </template>
    <template #item="item">
      <tr @mouseover="onMouseOver(item.item.id)" @mouseout="hovered = null">
        <td class="text-center">
          <span v-text="item.item.track" v-if="hovered !== item.item.id"></span>
          <v-icon size="28" v-if="hovered === item.item.id">mdi-play</v-icon>
        </td>
        <td>
          <span v-text="item.item.title"></span>
        </td>
        <td>
          <span v-text="item.item.durationFormatted"></span>
        </td>
        <td>
          <span v-text="item.item.playCount"></span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "VSSonglist",
  props: {
    songs: Array
  },
  data() {
    return {
      hovered: null,
      headers: [
        {
          text: "#",
          sortable: true,
          value: "track",
          width: 60
        },
        {
          text: "NAME",
          sortable: true,
          value: "title",
          width: "100%"
        },
        {
          text: "duration",
          sortable: false,
          align: "center",
          value: "durationFormatted"
        },
        {
          text: "pc",
          sortable: false,
          value: "playCount"
        }
      ]
    };
  },
  methods: {
    ...mapActions("stream", ["play"]),
    onMouseOver(id) {
      if (!this.currentSong || this.currentSong.id !== id) {
        this.hovered = id;
      }
    },
    playSong(item) {
      this.play({ song: item });
    }
  },
  computed: {
    ...mapState("stream", [{ currentSong: "song" }])
  }
};
</script>

<style scoped></style>
