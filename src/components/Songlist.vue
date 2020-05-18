<template>
  <v-data-table
    :hide-default-footer="true"
    class="elevation-1"
    :headers="headers"
    :items="songs"
  >
    <template #header.durationFormatted="">
      <v-icon size="medium">mdi-clock-time-four-outline</v-icon>
    </template>
    <template #header.playCount="">
      <v-icon size="medium">mdi-music-note</v-icon>
    </template>
    <template #header.star="">
      <v-icon size="medium">mdi-star</v-icon>
    </template>
    <template #item="item">
      <tr
        @mouseover="onMouseOver(item.item.id)"
        @click="playSong(item.item)"
        @mouseleave="hovered = null"
      >
        <td class="text-center">
          <span v-text="item.item.track" v-if="hovered !== item.item.id"></span>
          <v-icon size="28" v-if="hovered === item.item.id">mdi-play</v-icon>
        </td>
        <td>
          <span
            v-text="item.item.title"
            class="text-no-wrap text-truncate"
          ></span>
        </td>
        <td>
          <span v-text="item.item.durationFormatted"></span>
        </td>
        <td v-if="full">
          <span
            v-text="item.item.artist"
            class="text-no-wrap text-truncate"
          ></span>
        </td>
        <td v-if="full">
          <span
            v-text="item.item.album"
            class="text-no-wrap text-truncate"
          ></span>
        </td>
        <td>
          <span v-text="item.item.playCount"></span>
        </td>
        <td class="align-center justify-center text-center">
          <v-icon
            v-if="!item.item.starred && hovered === item.item.id"
            @click.stop="addStar(item.item)"
            >mdi-star-outline</v-icon
          >
          <v-icon v-if="!!item.item.starred" @click.stop="removeStar(item.item)"
            >mdi-star</v-icon
          >
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { PLAYLIST } from "@/store/streamStore";

export default {
  name: "VSSonglist",
  props: {
    songs: Array,
    full: Boolean,
    numbering: String
  },
  data() {
    return {
      hovered: null
    };
  },
  methods: {
    ...mapMutations("stream", [PLAYLIST]),
    ...mapActions("stream", ["play"]),
    ...mapActions("annotation", ["star"]),

    addStar(item) {
      this.star({ id: item.id, toggle: true });
    },
    removeStar(item) {
      this.star({ id: item.id, toggle: false });
    },
    onMouseOver(id) {
      if (!this.currentSong || this.currentSong.id !== id) {
        this.hovered = id;
      }
    },
    playSong(item) {
      this[PLAYLIST](this.songs);
      this.play({ song: item });
    }
  },
  computed: {
    ...mapState("stream", [{ currentSong: "song" }]),

    headers() {
      const headers = [
        {
          text: "#",
          sortable: true,
          class: "px-0",
          align: "center",
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
          text: "Duration",
          sortable: true,
          align: "center",
          value: "durationFormatted",
          width: 100
        },
        {
          text: "Play count",
          sortable: true,
          value: "playCount",
          class: "px-0",
          align: "center",
          width: 60
        },
        {
          text: "stars",
          sortable: true,
          class: "px-0",
          align: "center",
          value: "star",
          width: 60
        }
      ];
      if (this.full === true) {
        headers.splice(
          3,
          0,
          ...[
            {
              text: "ARTIST",
              sortable: true,
              value: "artist",
              width: "100%"
            },
            {
              text: "ALBUM",
              sortable: true,
              value: "album",
              width: "100%"
            }
          ]
        );
      }
      return headers;
    }
  }
};
</script>

<style scoped></style>
