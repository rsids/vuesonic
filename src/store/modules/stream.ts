import { Song } from "@/store/interfaces/song";
import { shuffle } from "@/utils/generic";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class StreamStore extends VuexModule {
  audio: HTMLAudioElement = document.createElement("audio");
  hasNext = false;
  hasPrev = false;
  history: Song[] = [];
  paused = true;
  progress = 0;
  playmode = -1;
  playlist: Song[] = [];
  repeat = false;
  song?: Song = undefined;

  @Mutation
  setHasNext(has: boolean): void {
    this.hasNext = has;
  }

  @Mutation
  setHasPrev(has: boolean): void {
    this.hasPrev = has;
  }

  @Mutation
  setRepeat(repeat: boolean): void {
    this.repeat = repeat;
  }

  @Mutation
  setSong(song: Song): void {
    this.song = song;

    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
      });
    }
    this.progress = 0;
    document.title = `${song.artist} - ${song.title} // VueSonic`;
  }

  @Mutation
  setPaused(): void {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "paused";
    }
    this.paused = true;
    this.audio.pause();
  }

  @Mutation
  setPlaying(): void {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "playing";
    }
    this.paused = false;
    this.audio.play();
  }

  @Mutation
  seek(seek: number): void {
    this.audio.currentTime = seek;
  }

  @Mutation
  setPlaylist({
    playlist,
    resetHistory = true,
  }: {
    playlist: Song[];
    resetHistory: boolean;
  }): void {
    if (resetHistory) {
      this.history = [];
    }
    this.playlist = [...playlist];
  }

  @Mutation
  addToPlaylist(playlist: Song[]): void {
    this.playlist = [...this.playlist, ...playlist];
  }

  @Mutation
  setProgress(value: number): void {
    this.progress = value;
  }

  @Action
  addToQueue({ songs }: { songs: Song[] }): void {
    this.context.commit("setPlaylist", {
      playlist: [...this.playlist, songs],
      resetHistory: false,
    });
  }

  @Action
  init(): void {
    this.audio.addEventListener("timeupdate", () => {
      this.context.commit("setProgress", this.audio.currentTime);
    });
    this.audio.addEventListener("ended", () => {
      this.context.dispatch("next");
    });

    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.context.dispatch("prev");
      });
      window.navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.context.dispatch("next");
      });
      window.navigator.mediaSession.setActionHandler("play", () => {
        this.context.commit("setPlaying");
      });

      window.navigator.mediaSession.setActionHandler("pause", () => {
        this.context.commit("setPaused");
      });
    }
  }

  @Action
  async play({ song }: { song: Song }): Promise<string> {
    this.context.commit("setPaused");
    const url = await this.context.dispatch(
      "connection/getUrl",
      { url: `stream?id=${song.id}` },
      { root: true }
    );
    this.audio.src = url;
    try {
      this.context.commit("setSong", song);
      this.context.commit("setPlaying");
      const idx = this.playlist.findIndex((s) => s.id === song.id);
      this.context.commit(
        "setHasNext",
        idx + 1 !== this.playlist.length || this.repeat
      );
      this.context.commit("setHasPrev", idx > 0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return url;
  }

  @Action
  next(): void {
    if (this.playlist && this.song) {
      const id = this.song.id;
      let idx = this.playlist.findIndex((song) => song.id === id);
      if (idx >= 0 && idx < this.playlist.length - 1) {
        idx++;
        this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
  }

  @Action
  playNext({ songs }: { songs: Song[] }): void {
    let idx = 0;
    if (this.song) {
      idx = this.playlist.indexOf(this.song) + 1;
    }
    const arr = [...this.playlist];
    arr.splice(idx, 0, ...songs);
    this.context.commit("setPlaylist", { playlist: arr, resetHistory: false });
    if (!this.song) {
      this.context.dispatch("play", { song: this.playlist[0] });
    }
  }

  @Action
  prev(): void {
    if (this.playlist && this.song) {
      const id = this.song.id;
      let idx = this.playlist.findIndex((song) => song.id === id);
      if (idx >= 0) {
        idx--;
        idx = idx < 0 ? this.playlist.length - 1 : idx;
        this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
  }

  @Action
  shuffleAndPlay({ songs }: { songs: Song[] }): void {
    this.context.commit("setPlaylist", {
      playlist: shuffle(([] as Song[]).concat(songs)),
    });
    this.context.dispatch("play", { song: this.playlist[0] });
  }
}
