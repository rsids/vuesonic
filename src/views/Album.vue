<template>
  <div>
    <v-container v-if="currentAlbum">
      <div class="d-flex mb-8">
        <v-s-cover :entity="currentAlbum" :size="160" type="artist"></v-s-cover>
        <div class="pl-4 pt-4">
          <h1 class="title">
            <span class="pr-4" v-text="currentAlbum.name"></span>
            <v-btn color="dark-grey" fab outlined small @click="playAlbum()">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </h1>
          <h2
            class="subtitle-1"
            @click="gotoArtist()"
            v-text="currentAlbum.artist"
          ></h2>
          <span class="subtitle-2">{{ metaData }}</span>
          <div class="d-flex justify-lg-space-between">
            <v-btn class="d-block btn-shuffle" text @click="shuffleAlbum()">
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
                  :songs="currentAlbum.song"
                  type="album"
                ></v-s-queue-menu>
                <v-divider></v-divider>
                <v-s-playlist-menu
                  :songs="currentAlbum.song"
                ></v-s-playlist-menu>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            :songs="currentAlbum.song"
            @click-song="playSong"
          ></v-s-songlist>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="notFound"
      description="Album not found"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script lang="ts">
import VSEmptyState from "@/components/EmptyState.vue";
import { duration, noop } from "@/utils/generic";
import VSSonglist from "@/components/Songlist.vue";
import VSCover from "@/components/Cover.vue";
import VSPlaylistMenu from "@/components/PlaylistMenu.vue";
import VSQueueMenu from "@/components/QueueMenu.vue";
import { Component, Vue } from "vue-property-decorator";
import { Album as IAlbum } from "@/store/interfaces/album";
import { album } from "@/store/modules/album";
import { stream } from "@/store/modules/stream";
import { Song } from "@/store/interfaces/song";

@Component({
  name: "Album",
  components: {
    VSQueueMenu,
    VSPlaylistMenu,
    VSCover,
    VSSonglist,
    VSEmptyState,
  },
})
export default class Album extends Vue {
  cover = "";
  notFound = false;

  @album.State currentAlbum!: IAlbum;
  @album.Action getAlbum;
  @album.Action getCoverArt;
  @album.Mutation setAlbum;

  @stream.Action play;
  @stream.Action shuffleAndPlay;
  @stream.Mutation setPlaylist;

  get metaData(): string {
    const data: string[] = [];
    if (this?.currentAlbum.year) {
      data.push(this.currentAlbum.year.toString(10));
    }
    if (this?.currentAlbum.songCount) {
      data.push(`${this.currentAlbum.songCount} songs`);
    }
    if (this?.currentAlbum.duration) {
      data.push(duration(this.currentAlbum.duration));
    }
    if (this?.currentAlbum.genre) {
      data.push(this.currentAlbum.genre);
    }
    return data.join(" • ");
  }

  mounted(): void {
    this.getAlbum(this.$route.params).then(noop, (err) => {
      if (err.error.code === 70) {
        // 404
        this.notFound = true;
      }
    });
  }

  destroyed(): void {
    this.setAlbum(null);
  }

  gotoArtist(): void {
    const artist = encodeURIComponent(
      this.currentAlbum.artist.split(" ").join("-")
    );

    this.$router.push(
      `/library/artists/${this.currentAlbum.artistId}/${artist}`
    );
  }

  playAlbum(): void {
    this.setPlaylist({ playlist: this.currentAlbum.song });
    this.play({ song: this.currentAlbum.song[0] });
  }

  playSong({ song }: { song: Song }): void {
    this.setPlaylist({ playlist: this.currentAlbum.song });
    this.play({ song });
  }

  shuffleAlbum(): void {
    this.shuffleAndPlay({ songs: this.currentAlbum.song });
  }
}
</script>

<style lang="scss" scoped>
.btn-shuffle {
  padding-left: 0 !important;

  .v-icon {
    padding-right: 8px;
  }
}
</style>
