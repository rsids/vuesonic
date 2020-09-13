<template>
  <v-data-table
    :hide-default-footer="true"
    class="elevation-1 fixed-table"
    disable-pagination
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
        <td class="px-0 text-center">
          <span v-if="hovered !== item.item.id">
            <span v-if="numbering === 'track'" v-text="item.item.track"></span>
            <span v-else v-text="songs.indexOf(item.item) + 1"></span>
          </span>
          <v-icon size="28" v-if="hovered === item.item.id">mdi-play</v-icon>
        </td>
        <td>
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span
                v-text="item.item.title"
                class="text-no-wrap text-truncate"
              ></span>
              <span v-if="dense" class="caption"
                >{{ item.item.artist }} - {{ item.item.album }}</span
              >
            </div>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-s-queue-menu :songs="[item.item]"></v-s-queue-menu>
                <v-divider></v-divider>
                <v-s-playlist-menu :songs="[item.item]"></v-s-playlist-menu>
                <v-divider v-if="hasMenuOptions"></v-divider>
                <slot
                  name="menuoptions"
                  v-bind:song="item.item"
                  v-bind:index="songs.indexOf(item.item)"
                ></slot>
              </v-list>
            </v-menu>
          </div>
        </td>
        <td class="px-0">
          <span v-text="item.item.durationFormatted"></span>
        </td>
        <td v-if="full && !dense">
          <span
            v-text="item.item.artist"
            class="text-no-wrap text-truncate"
          ></span>
        </td>
        <td v-if="full && !dense">
          <span
            v-text="item.item.album"
            class="text-no-wrap text-truncate"
          ></span>
        </td>
        <td class="px-2">
          <span v-text="item.item.playCount"></span>
        </td>
        <td class="align-center justify-center text-center px-0">
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
import { PLAYLIST } from "@/store/modules/stream";
import VSPlaylistMenu from "@/components/PlaylistMenu";
import VSQueueMenu from "@/components/QueueMenu";

export default {
  name: "VSSonglist",
  components: { VSQueueMenu, VSPlaylistMenu },
  props: {
    songs: Array,
    dense: Boolean,
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
      this[PLAYLIST]({ playlist: this.songs });
      this.play({ song: item });
    }
  },
  computed: {
    ...mapState("stream", [{ currentSong: "song" }]),
    hasMenuOptions() {
      return !!this.$slots["menuoptions"];
    },
    headers() {
      const headers = [
        {
          text: "#",
          sortable: true,
          class: "px-0 text-center",
          align: "center",
          value: "track",
          width: 40
        },
        {
          text: "NAME",
          sortable: true,
          value: "title",
          class: "sizeable-col"
        },
        {
          text: "Duration",
          sortable: true,
          align: "center",
          class: "px-0",
          value: "durationFormatted",
          width: 60
        },
        {
          text: "Play count",
          sortable: true,
          value: "playCount",
          class: "px-2",
          align: "center",
          width: 40
        },
        {
          text: "stars",
          sortable: true,
          class: "px-0",
          align: "center",
          value: "star",
          width: 50
        }
      ];
      if (this.full && !this.dense) {
        headers.splice(
          3,
          0,
          ...[
            {
              text: "ARTIST",
              sortable: true,
              value: "artist",
              class: "sizeable-col"
            },
            {
              text: "ALBUM",
              sortable: true,
              value: "album",
              class: "sizeable-col"
            }
          ]
        );
      }
      return headers;
    }
  }
};
</script>

<style>
.sizeable-col {
  min-width: 60px;
  max-width: 100%;
}
.fixed-table table {
  table-layout: fixed;
}
</style>
