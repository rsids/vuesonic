<template>
  <div>
    <v-container v-if="currentPlaylist">
      <div class="d-flex mb-8">
        <v-img :src="cover" max-height="160" max-width="160"></v-img>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="album-title" v-text="currentPlaylist.name"></span>
            <v-btn
              v-if="currentPlaylist.songCount > 0"
              color="dark-grey"
              fab
              outlined
              small
              @click="playIt()"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </h1>
          <span class="subtitle-2">{{ metaData }}</span>
          <v-btn
            :disabled="currentPlaylist.songCount === 0"
            class="d-block btn-text-with-icon"
            text
          >
            <v-icon>mdi-shuffle</v-icon>
            shuffle
          </v-btn>
          <div class="d-flex flex-row">
            <v-btn class="d-block btn-text-with-icon" text>
              <v-icon>mdi-pencil</v-icon>
              edit
            </v-btn>
            <v-btn class="d-block btn-text-with-icon" text @click="deleteIt()">
              <v-icon>mdi-delete</v-icon>
              delete
            </v-btn>
          </div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            v-if="currentPlaylist.songCount > 0"
            @click-song="playSong"
            :full="true"
            :numbering="'index'"
            :songs="currentPlaylist.entry"
          >
            <template v-slot:menuoptions="slotProps">
              <v-list-item @click.stop="removeFromPlaylist(slotProps)">
                <v-list-item-title>Remove from playlist</v-list-item-title>
              </v-list-item>
            </template>
          </v-s-songlist>
          <v-s-empty-state
            v-if="currentPlaylist.songCount === 0"
            description="Your playlist is empty, add some songs to it!"
            icon="mdi-album"
          ></v-s-empty-state>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Playlist not found"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VSEmptyState from "@/components/EmptyState.vue";
import { duration } from "@/utils/generic";
import VSSonglist from "@/components/Songlist.vue";
import { playlist } from "@/store/modules/playlist";
import { album } from "@/store/modules/album";
import { stream } from "@/store/modules/stream";
import { Song } from "@/store/interfaces/song";

@Component({
  name: "Playlist",
  components: { VSSonglist, VSEmptyState },
})
export default class Playlist extends Vue {
  @album.Action getCoverArt;
  @playlist.Action getPlaylist;
  @playlist.Action deletePlaylist;
  @playlist.Action updatePlaylist;
  @playlist.State currentPlaylist;
  @stream.Action play;
  @stream.Mutation setPlaylist;

  cover = "";
  notFound = false;

  get metaData(): string {
    const data: string[] = [];
    if (this?.currentPlaylist.songCount) {
      data.push(`${this.currentPlaylist.songCount} songs`);
    }
    if (this?.currentPlaylist.duration) {
      data.push(duration(this.currentPlaylist.duration));
    }
    return data.join(" • ");
  }

  mounted(): void {
    this.getPlaylist(this.$route.params).then(
      (playlist) => {
        if (playlist.coverArt) {
          this.getCoverArt({ id: playlist.coverArt }).then((cover) => {
            this.cover = window.URL.createObjectURL(cover);
          });
        }
      },
      (err) => {
        if (err.error.code === 70) {
          // 404
          this.notFound = true;
        }
      }
    );
  }

  playIt(): void {
    this.setPlaylist({ playlist: this.currentPlaylist.entry });
    this.play({ song: this.currentPlaylist.entry[0] });
  }

  playSong({ song }: { song: Song }): void {
    this.setPlaylist({ playlist: this.currentPlaylist.entry });
    this.play({ song });
  }

  async deleteIt(): Promise<void> {
    const res = await this.$dialog.confirm({
      text: "Are you sure you want to delete this playlist?",
      title: "Warning",
    });

    if (res) {
      this.deletePlaylist(this.currentPlaylist).then(() => {
        this.$router.push({ name: "playlists" });
      });
    }
  }

  removeFromPlaylist({ index }: { index: number }): void {
    this.updatePlaylist({
      playlistId: this.currentPlaylist.id,
      songIndexToRemove: index,
    }).then(() => {
      this.$dialog.message.info("1 song removed from playlist", {
        position: "bottom-left",
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.btn-text-with-icon {
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
