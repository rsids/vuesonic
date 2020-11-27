import Vuex, { Store } from "vuex";
import ArtistStore from "@/store/modules/artist";
import { createLocalVue } from "@vue/test-utils";
import { cloneDeep } from "lodash";
import { Artist } from "@/store/interfaces/artist";
import Vue from "vue";
import Mock = jest.Mock;

describe("artist store", () => {
  let store: Store<ArtistStore>;
  let artist: Artist;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({
      modules: {
        artist: cloneDeep(ArtistStore),
      },
    });
    artist = {
      id: 36,
      name: "Muse",
      coverArt: "ar-36",
      albumCount: 8,
      album: [
        {
          id: 68,
          name: "Absolution",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-68",
          songCount: 14,
          duration: 3135,
          created: "2014-04-08T20:16:35.000Z",
          year: 2003,
          genre: "Rock",
          song: [],
        },
        {
          id: 69,
          name: "Black Holes And Revelations",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-69",
          songCount: 11,
          duration: 2728,
          created: "2014-04-08T20:17:31.000Z",
          year: 2006,
          genre: "Rock",
          song: [],
        },
        {
          id: 72,
          name: "Drones",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-72",
          songCount: 12,
          duration: 3179,
          created: "2015-10-25T14:23:00.000Z",
          year: 2015,
          genre: "Pop / Rock",
          song: [],
        },
        {
          id: 74,
          name: "H.A.A.R.P. Live From Wembley Disc 1",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-74",
          songCount: 14,
          duration: 4309,
          created: "2014-04-08T20:17:32.000Z",
          year: 2008,
          genre: "Rock",
          song: [],
        },
        {
          id: 73,
          name: "Origin Of Symmetry",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-73",
          songCount: 11,
          duration: 3095,
          created: "2014-04-08T20:17:33.000Z",
          year: 2001,
          genre: "Alternative",
          song: [],
        },
        {
          id: 75,
          name: "Showbiz",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-75",
          songCount: 12,
          duration: 2980,
          created: "2014-04-08T20:17:47.000Z",
          year: 1999,
          genre: "Other",
          song: [],
        },
        {
          id: 71,
          name: "The 2nd Law",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-71",
          songCount: 13,
          duration: 3207,
          created: "2014-04-08T19:40:30.000Z",
          year: 2012,
          genre: "Indie Rock",
          song: [],
        },
        {
          id: 70,
          name: "The Resistance",
          artist: "Muse",
          artistId: 36,
          coverArt: "al-70",
          songCount: 11,
          duration: 3254,
          created: "2014-04-08T20:18:01.000Z",
          year: 2009,
          genre: "Brit Rock",
          song: [],
        },
      ],
    };
  });
  describe("mutations", () => {
    it("should set the current artist", () => {
      store.commit("artist/setArtist", artist);
      expect(store.state["artist"].currentArtist).toEqual(artist);
    });
  });

  describe("actions", () => {
    describe("getArtists", () => {
      it("should get an alfabetical list of artists", async () => {
        (Vue.prototype.axios["get"] as Mock).mockImplementationOnce(() =>
          Promise.resolve({
            artists: {
              ignoredArticles: "The El La Los Las Le Les",
              index: [
                {
                  name: "M",
                  artist: [
                    {
                      id: "36",
                      name: "Muse",
                      coverArt: "ar-36",
                      albumCount: 8,
                    },
                  ],
                },
                {
                  name: "S",
                  artist: [
                    {
                      id: "163",
                      name: "System Of A Down",
                      coverArt: "ar-163",
                      albumCount: 6,
                    },
                  ],
                },
              ],
            },
          })
        );
        const promise = store.dispatch("artist/getArtists");
        await promise;
        expect(store.state["artist"].artists).toEqual([
          {
            id: "36",
            name: "Muse",
            coverArt: "ar-36",
            albumCount: 8,
          },
          {
            id: "163",
            name: "System Of A Down",
            coverArt: "ar-163",
            albumCount: 6,
          },
        ]);
      });
    });

    describe("getArtist", () => {
      it("should fetch the artist from the backend", async () => {
        (Vue.prototype.axios["get"] as Mock).mockImplementation(() =>
          Promise.resolve({
            artist: artist,
          })
        );
        const promise = store.dispatch("artist/getArtist", { id: 36 });
        await promise;
        expect(store.state["artist"].currentArtist).toEqual(artist);
      });

      // Caching not implemented yet
      xit("should fetch the artist only once from the backend", async () => {
        const mock = (Vue.prototype.axios["get"] as Mock).mockImplementation(
          () =>
            Promise.resolve({
              artist: artist,
            })
        );
        let promise = store.dispatch("artist/getArtist", { id: 73 });
        await promise;
        promise = store.dispatch("artist/getArtist", { id: 73 });
        await promise;
        expect(store.state["artist"].currentArtist).toEqual(artist);
        expect(mock.mock.calls.length).toEqual(1);
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
