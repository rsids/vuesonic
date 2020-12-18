<template>
  <div>
    <v-container v-if="starred && starred.length > 0">
      <div class="d-flex mb-8">
        <div class="no-cover">
          <v-icon size="160">mdi-star</v-icon>
        </div>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="pr-4">Starred songs</span>
            <v-btn color="dark-grey" fab outlined small @click="playAll()">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </h1>
          <span class="subtitle-2">{{ metadata }}</span>
          <div class="d-flex justify-lg-space-between">
            <v-btn class="d-block btn-shuffle" text @click="shuffleStarred()">
              <v-icon>mdi-shuffle</v-icon>
              shuffle
            </v-btn>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-s-queue-menu
                  :songs="starred"
                  type="starred"
                ></v-s-queue-menu>
                <v-divider></v-divider>
                <v-s-playlist-menu :songs="starred"></v-s-playlist-menu>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            :songs="starred"
            :full="true"
            :numbering="'index'"
          ></v-s-songlist>
          <v-s-save-playlist
            label="Save as playlist"
            :songs="starred"
          ></v-s-save-playlist>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="loaded && starred && starred.length === 0"
      description="No starred items!"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script lang="ts">
import VSSonglist from "@/components/Songlist.vue";
import VSSavePlaylist from "@/components/SavePlaylist.vue";
import { Component, Vue } from "vue-property-decorator";
import VSEmptyState from "@/components/EmptyState.vue";
import { album } from "@/store/modules/album";
import { Song } from "@/store/interfaces/song";
import { duration, shuffle } from "@/utils/generic";
import VSPlaylistMenu from "@/components/PlaylistMenu.vue";
import VSQueueMenu from "@/components/QueueMenu.vue";
import { stream } from "@/store/modules/stream";

@Component({
  name: "Playlist",
  components: {
    VSQueueMenu,
    VSPlaylistMenu,
    VSSavePlaylist,
    VSSonglist,
    VSEmptyState,
  },
})
export default class Starred extends Vue {
  @album.Action getStarred!: () => Promise<unknown>;
  @album.State starred!: Song[];

  @stream.Action play!: (_) => void;
  @stream.Mutation setPlaylist!: (_) => void;

  cover = "";
  loaded = false;

  mounted(): void {
    this.getStarred().then(() => (this.loaded = true));
  }

  playAll(): void {
    this.setPlaylist({ playlist: this.starred });
    this.play({ song: this.starred[0] });
  }

  shuffleStarred(): void {
    const shuffled = shuffle(this.starred);
    this.setPlaylist({ playlist: shuffled });
    this.play({ song: shuffled[0] });
  }

  get metadata(): string {
    const count = this.starred.length;
    const len = duration(
      this.starred.reduce((d, song) => {
        d += song.duration;
        return d;
      }, 0)
    );
    return `${count} songs  • ${len} hours`;
  }
}
</script>

<style scoped lang="scss">
.btn-shuffle {
  padding-left: 0 !important;
  .v-icon {
    padding-right: 8px;
  }
}
.album-title {
  display: inline-block;
  padding-right: 16px;
}
</style>
