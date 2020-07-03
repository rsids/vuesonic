import "jest";
import {
  SET_RECENTS,
  album as albumStore,
  SET_ALBUM,
  SET_ALBUMS,
  UPDATE_STAR,
  SET_COVER
} from "@/store/modules/album";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";
import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";

describe("album store", () => {
  let store;
  let album: Album;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store(cloneDeep(albumStore));
    album = {
      album: "Origin of Symmetry",
      artistId: 42,
      coverArt: "",
      created: "",
      duration: 3101,
      id: 73,
      song: [
        {
          id: 1309,
          parent: 1241,
          isDir: false,
          title: "New Born",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 1,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 8756864,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 363,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/01 - Muse - New Born.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1305,
          parent: 1241,
          isDir: false,
          title: "Bliss",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 2,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 6097616,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 252,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/02 - Muse - Bliss.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1312,
          parent: 1241,
          isDir: false,
          title: "Space Dementia",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 3,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 9173154,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 380,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/03 - Muse - Space Dementia.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1308,
          parent: 1241,
          isDir: false,
          title: "Hyper Music",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 4,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 4873160,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 201,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/04 - Muse - Hyper Music.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1306,
          parent: 1241,
          isDir: false,
          title: "Plug In Baby",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 5,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 5315116,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 219,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/05 - Muse - Plug In Baby.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1315,
          parent: 1241,
          isDir: false,
          title: "Citizen Erased",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 6,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 10574768,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 439,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/06 - Muse - Citizen Erased.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1314,
          parent: 1241,
          isDir: false,
          title: "Micro Cuts",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 7,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 5286946,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 218,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/07 - Muse - Micro Cuts.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1311,
          parent: 1241,
          isDir: false,
          title: "Screenager",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 8,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 6278530,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 259,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/08 - Muse - Screenager.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1310,
          parent: 1241,
          isDir: false,
          title: "Darkshines",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 9,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 6945502,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 287,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/09 - Muse - Darkshines.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1307,
          parent: 1241,
          isDir: false,
          title: "Feeling Good",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 10,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 4834974,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 199,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/10 - Muse - Feeling Good.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        },
        {
          id: 1313,
          parent: 1241,
          isDir: false,
          title: "Megalomania",
          album: "Origin Of Symmetry",
          artist: "Muse",
          track: 11,
          year: 2001,
          genre: "Alternative",
          coverArt: 1241,
          size: 6711722,
          contentType: "audio/mpeg",
          suffix: "mp3",
          duration: 278,
          bitRate: 192,
          path: "Muse/Origin of Symmetry/11 - Muse - Megalomania.Mp3",
          isVideo: false,
          playCount: 0,
          created: "2014-04-08T20:17:33.000Z",
          albumId: 73,
          artistId: 36,
          type: "music"
        }
      ],
      songCount: 11,
      starred: false,
      year: 2001,
      artist: "Muse",
      name: "Origin of Symmetry"
    };
  });
  describe("mutations", () => {
    it("should set the recent albums", () => {
      store.commit(SET_RECENTS, [album]);
      expect(store.state.recents).toEqual([album]);
    });

    it("should set the current album", () => {
      store.commit(SET_ALBUM, album);
      expect(store.state.currentAlbum).toEqual(album);
    });

    it("should set the albums", () => {
      store.commit(SET_ALBUMS, { albums: [album], hasMoreAlbums: false });
      expect(store.state.albums).toEqual([album]);
      expect(store.state.hasMoreAlbums).toBeFalsy();
    });

    it("should set the cover", () => {
      const cover: Cover = {
        id: "73",
        cover: "coverArt"
      };
      store.commit(SET_COVER, cover);
      expect(store.state.covers.has("73")).toBeTruthy();
      expect(store.state.covers.get("73")).toEqual("coverArt");
    });

    it("star the album by albumId", () => {
      store.commit(SET_ALBUM, album);
      expect(store.state.currentAlbum.starred).toBeFalsy();
      store.commit(UPDATE_STAR, { albumId: 73, toggle: true });
      expect(store.state.currentAlbum.starred).toBeTruthy();
    });

    it("star song by Id", () => {
      store.commit(SET_ALBUM, album);
      expect(store.state.currentAlbum.starred).toBeFalsy();
      store.commit(UPDATE_STAR, { id: 1305, toggle: true });
      expect(
        store.state.currentAlbum.song.find(s => s.id === 1305).starred
      ).toBeTruthy();
    });
  });
});
