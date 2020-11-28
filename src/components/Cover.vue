<template>
  <div
    class="cover-container"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div v-intersect:once="loadCover">
      <v-icon :size="size" v-if="cover === ''" class="no-cover"
        >{{ icon }}
      </v-icon>
      <v-img
        v-if="cover !== ''"
        aspect-ratio="1"
        :max-width="size"
        :width="size"
        :max-height="size"
        :height="size"
        :src="cover"
      ></v-img>
    </div>
    <v-btn
      small
      class="btn--play"
      fab
      v-if="hover && type !== 'artist'"
      @click.stop="playIt()"
      ><v-icon>mdi-play</v-icon></v-btn
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";
import { Album } from "@/store/interfaces/album";
import { Artist } from "@/store/interfaces/artist";
import { Playlist } from "@/store/interfaces/playlist";
import { Song } from "@/store/interfaces/song";
import { VuetifyDialog } from "vuetify-dialog";
import { album } from "@/store/modules/album";
import { stream } from "@/store/modules/stream";

interface PlayArgs {
  song: Song;
}
interface CoverartArgs {
  id: string;
}

@Component({
  name: "VSCover",
})
export default class Cover extends Vue {
  $dialog!: VuetifyDialog;

  @Provide() cover = "";
  @Provide() hover = false;
  @Provide() request = null;
  @Provide() requested = false;
  @Prop() size!: number;
  @Prop() entity!: Album | Artist | Playlist;
  @Prop() type!: string;

  @album.Action getCoverArt!: (c: CoverartArgs) => Promise<unknown>;
  @album.Action getAlbumFromMusicDirectory!: (album: Album) => Promise<Album>;
  @album.Action getAlbum!: (album: Album) => Promise<Album>;
  @stream.Action play!: (p: PlayArgs) => void;

  get icon(): string {
    if (this.type === "artist") {
      return "mdi-account";
    } else if (this.type === "album") {
      return "mdi-album";
    }
    return "mdi-playlist";
  }

  playIt(): void {
    if (this.type === "album") {
      if (this.entity.id) {
        this.getAlbum(this.entity as Album).then(
          (album) => {
            // @todo enable
            // this[PLAYLIST]({ playlist: album.song });
            this.play({ song: album.song[0] });
          },
          (error) => {
            if (error.error.code === 70) {
              this.$dialog.notify.error("Album not found", {
                position: "bottom-left",
              });
            }
          }
        );
      } else {
        this.getAlbumFromMusicDirectory(this.entity as Album).then((album) => {
          // @todo enable
          // this[PLAYLIST]({ playlist: album.song });
          this.play({ song: album.song[0] });
        });
      }
    }
  }

  loadCover(): void {
    if (!this.requested) {
      this.requested = true;
      this.getCover();
    }
  }

  getCover(): void {
    if (
      this.requested &&
      this.entity &&
      this.entity.coverArt &&
      this.entity.coverArt !== ""
    ) {
      this.getCoverArt({ id: this.entity.coverArt }).then((cover) => {
        this.cover = window.URL.createObjectURL(cover);
      });
    } else {
      this.cover = "";
    }
  }

  @Watch("entity", { immediate: true })
  onEntityChanged(): void {
    this.getCover();
  }
}
</script>

<style scoped>
.no-cover {
  background: #eeeeee;
}
.cover-container {
  position: relative;
}
.btn--play {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
