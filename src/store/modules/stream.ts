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
  setHasNext(has) {
    this.hasNext = has;
  }

  @Mutation
  setHasPrev(has) {
    this.hasPrev = has;
  }

  @Mutation
  setRepeat(repeat) {
    this.repeat = repeat;
  }

  @Mutation
  setSong(song: Song) {
    this.song = song;

    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album
      });
    }
    this.progress = 0;
    document.title = `${song.artist} - ${song.title} // VueSonic`;
  }

  @Mutation
  setPaused() {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "paused";
    }
    this.paused = true;
    this.audio.pause();
  }

  @Mutation
  setPlaying() {
    if (window.navigator.mediaSession) {
      window.navigator.mediaSession.playbackState = "playing";
    }
    this.paused = false;
    this.audio.play();
  }

  @Mutation
  seek(seek) {
    this.audio.currentTime = seek;
  }

  @Mutation
  setPlaylist({ playlist, resetHistory = true }) {
    if (resetHistory) {
      this.history = [];
    }
    this.playlist = [...playlist];
  }

  @Mutation
  addToPlaylist(playlist: Song[]) {
    this.playlist = [...this.playlist, ...playlist];
  }

  @Mutation
  setProgress(value: number) {
    this.progress = value;
  }

  @Action
  addToQueue({ songs }) {
    this.context.commit("setPlaylist", {
      playlist: [...this.playlist, songs],
      resetHistory: false
    });
  }

  @Action
  init() {
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
  async play({ song }) {
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
      const idx = this.playlist.findIndex(s => s.id === song.id);
      this.context.commit(
        "setHasNext",
        idx + 1 !== this.playlist.length || this.repeat
      );
      this.context.commit("setHasPrev", idx > 0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  @Action
  next() {
    if (this.playlist && this.song) {
      const id = this.song.id;
      let idx = this.playlist.findIndex(song => song.id === id);
      if (idx >= 0 && idx < this.playlist.length - 1) {
        idx++;
        this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
  }

  @Action
  playNext({ songs }) {
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
  prev() {
    if (this.playlist && this.song) {
      const id = this.song.id;
      let idx = this.playlist.findIndex(song => song.id === id);
      if (idx >= 0) {
        idx--;
        idx = idx < 0 ? this.playlist.length - 1 : idx;
        this.context.dispatch("play", { song: this.playlist[idx] });
      }
    }
  }

  @Action
  shuffleAndPlay({ songs }) {
    this.context.commit("setPlaylist", { playlist: shuffle([].concat(songs)) });
    this.context.dispatch("play", { song: this.playlist[0] });
  }
}
