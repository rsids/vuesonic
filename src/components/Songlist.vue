<template>
  <v-data-table
    :headers="headers"
    :hide-default-footer="true"
    :items="songs"
    class="elevation-1 fixed-table"
    disable-pagination
  >
    <template v-slot:[`header.durationFormatted`]="">
      <v-icon size="medium">mdi-clock-time-four-outline</v-icon>
    </template>
    <template v-slot:[`header.playCount`]="">
      <v-icon size="medium">mdi-music-note</v-icon>
    </template>
    <template v-slot:[`header.star`]="">
      <v-icon size="medium">mdi-star</v-icon>
    </template>
    <template #item="item">
      <tr
        @click="playSong(item)"
        @mouseleave="hovered = null"
        @mouseover="onMouseOver(item.item.id)"
      >
        <td v-if="numbering !== 'none'" class="px-0 text-center">
          <span v-if="hovered !== item.item.id">
            <span v-if="numbering === 'track'" v-text="item.item.track"></span>
            <span v-else v-text="songs.indexOf(item.item) + 1"></span>
          </span>
          <v-icon v-if="hovered === item.item.id" size="28">mdi-play</v-icon>
        </td>
        <td>
          <div class="d-flex align-center">
            <div class="d-flex flex-column text-truncate">
              <span class="text-no-wrap" v-text="item.item.title"></span>
              <span v-if="dense" class="caption text-no-wrap"
                >{{ item.item.artist }} - {{ item.item.album }}</span
              >
            </div>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
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
                  :index="songs.indexOf(item.item)"
                  :song="item.item"
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
            class="text-no-wrap d-inline-block text-truncate"
            v-text="item.item.artist"
            @click.stop="gotoArtist(item.item)"
          ></span>
        </td>
        <td
          v-if="full && !dense"
          class="text-no-wrap text-truncate"
          v-text="item.item.album"
          @click.stop="gotoAlbum(item.item)"
        ></td>
        <td class="px-2">
          <span v-text="item.item.playCount"></span>
        </td>
        <td class="align-center justify-center text-center px-0">
          <v-icon
            v-if="!item.item.starred && hovered === item.item.id"
            @click.stop="addStar(item.item)"
            >mdi-star-outline
          </v-icon>
          <v-icon v-if="!!item.item.starred" @click.stop="removeStar(item.item)"
            >mdi-star
          </v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import VSPlaylistMenu from "@/components/PlaylistMenu.vue";
import VSQueueMenu from "@/components/QueueMenu.vue";
import { getArtistUrl } from "@/utils/generic";
import { Song } from "@/store/interfaces/song";
import { Component, Prop, Vue } from "vue-property-decorator";
import { stream } from "@/store/modules/stream";
import { annotation } from "@/store/modules/annotation";

interface ListItem {
  index: number;
  item: Song;
}

@Component({
  name: "VSSonglist",
  components: { VSQueueMenu, VSPlaylistMenu },
})
export default class Songlist extends Vue {
  @Prop() songs!: Song[];
  @Prop() dense!: boolean;
  @Prop() full!: boolean;
  @Prop() numbering!: string;

  hovered = 0;

  @annotation.Action star;
  @stream.Action play;
  @stream.Mutation setPlaylist;
  @stream.State("song") currentSong!: Song;

  addStar({ id }: { id: number }): void {
    this.star({ id, toggle: true });
  }

  removeStar({ id }: { id: number }): void {
    this.star({ id, toggle: false });
  }

  onMouseOver(id: number): void {
    this.hovered = id;
  }

  playSong(item: ListItem): void {
    this.$emit("click-song", { index: item.index, song: item.item });
  }

  gotoArtist(song: Song): void {
    const url = getArtistUrl(song);
    if (url) {
      this.$router.push(url);
    }
  }

  gotoAlbum(song: Song): void {
    const artist = encodeURIComponent(song.artist.split(" ").join("-"));
    const album = encodeURIComponent(song.album.split(" ").join("-"));
    const url = `/library/albums/${song.albumId}/${artist}/${album}`.toLowerCase();
    this.$router.push(url);
  }
  get hasMenuOptions(): boolean {
    return !!this.$slots["menuoptions"];
  }

  get headers(): unknown[] {
    const headers = [
      {
        text: "#",
        sortable: true,
        class: "px-0 text-center",
        align: "center",
        value: "track",
        width: 40,
      },
      {
        text: "NAME",
        sortable: true,
        value: "title",
        class: "sizeable-col",
      },
      {
        text: "Duration",
        sortable: true,
        align: "center",
        class: "px-0",
        value: "durationFormatted",
        width: 60,
      },
      {
        text: "Play count",
        sortable: true,
        value: "playCount",
        class: "px-2",
        align: "center",
        width: 40,
      },
      {
        text: "stars",
        sortable: true,
        class: "px-0",
        align: "center",
        value: "star",
        width: 50,
      },
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
            class: "sizeable-col",
          },
          {
            text: "ALBUM",
            sortable: true,
            value: "album",
            class: "sizeable-col",
          },
        ]
      );
    }

    if (this.numbering === "none") {
      headers.splice(0, 1);
    }
    return headers;
  }
}
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
