import { Song } from "@/store/interfaces/song";
import { shuffle } from "@/utils/generic";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { namespace } from "vuex-class";

export const stream = namespace("stream");

interface Songlist {
  songs: Song[];
}

@Module({ namespaced: true })
export default class StreamStore extends VuexModule {
  audio: HTMLAudioElement = document.createElement("audio");
  hasNext = false;
  hasPrev = false;
  history: Song[] = [];
  paused = true;
  progress = 0;
  playmode = -1;
  idx = -1;
  playlist: Song[] = [];
  repeat = false;
  song?: Song = undefined;

  @Mutation
  setIdx(i: number): void {
    this.idx = i;
    this.hasPrev = i > 0;
    this.hasNext = i < this.playlist.length - 1;
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
  setPaused(paused = true): void {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "paused";
    }
    this.paused = paused;
    this.audio.pause();
  }

  @Mutation
  setPlaying(): void {
    if (this.song) {
      this.audio.play().then(() => {
        this.paused = false;
        if (window.navigator.mediaSession) {
          window.navigator.mediaSession.playbackState = "playing";
        }
      });
    }
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
  setProgress(value: number): void {
    this.progress = value;
  }

  @Action
  addToQueue(songs: Song[]): void {
    this.context.commit("setPlaylist", {
      playlist: [...this.playlist, ...songs],
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
    // Sanity
    if (
      this.idx < 0 ||
      this.idx >= this.playlist.length ||
      this.playlist[this.idx].id !== song.id
    ) {
      this.context.commit("setIdx", this.playlist.indexOf(song));
    }
    this.context.commit("setPaused");
    const url = await this.context.dispatch(
      "server/getUrl",
      { url: `stream?id=${song.id}` },
      { root: true }
    );
    this.audio.src = url;
    try {
      this.context.commit("setSong", song);
      this.context.commit("setPlaying");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `Cannot play song ${song.artist} - ${song.title}, reason:`,
        e
      );
    }
    return url;
  }

  @Action
  playIndex(idx: number): Promise<string> {
    if (this.playlist && idx > 0 && idx < this.playlist.length) {
      this.context.commit("setIdx", idx);
      return this.context.dispatch("play", { song: this.playlist[idx] });
    }
    return Promise.reject("no playlist or out of bounds");
  }

  @Action
  next(): Promise<string> {
    if (this.playlist) {
      const idx = this.idx + 1;
      if (idx >= 0 && idx < this.playlist.length) {
        this.context.commit("setIdx", idx);
        return this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
    return Promise.reject("no playlist or out of bounds");
  }

  @Action
  playNext({ songs }: Songlist): Promise<string> | undefined {
    const arr = [...this.playlist];
    arr.splice(this.idx + 1, 0, ...songs);
    this.context.commit("setPlaylist", { playlist: arr, resetHistory: false });
    if (!this.song) {
      this.context.commit("setIdx", 0);
      return this.context.dispatch("play", { song: this.playlist[this.idx] });
    }
  }

  @Action
  playNow({ songs }: Songlist): Promise<string> {
    this.context.commit("setPlaylist", { playlist: songs });
    this.context.commit("setIdx", 0);
    return this.context.dispatch("play", { song: this.playlist[this.idx] });
  }

  @Action
  prev(): Promise<string> {
    if (this.playlist) {
      const idx = this.idx - 1;
      if (idx >= 0) {
        this.context.commit("setIdx", idx);
        return this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
    return Promise.reject("no playlist or out of bounds");
  }

  @Action
  shuffleAndPlay({ songs }: { songs: Song[] }): void {
    this.context.dispatch("playNow", {
      songs: shuffle(([] as Song[]).concat(songs)),
    });
  }
}
