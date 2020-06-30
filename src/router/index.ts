import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Album from "../views/Album.vue";
import Library from "../views/Library.vue";
import Artist from "../views/Artist.vue";
import Artists from "../views/Artists.vue";
import Playlists from "../views/Playlists.vue";
import Recent from "../views/Recent.vue";
import Albums from "../views/Albums.vue";
import Playlist from "../views/Playlist.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/recents",
    alias: "",
    name: "Recent Activity",
    component: Recent
  },
  {
    path: "/library",
    name: "Music Library",
    component: Library,
    children: [
      {
        path: "artists",
        name: "artists",
        component: Artists
      },
      {
        path: "playlists",
        name: "playlists",
        alias: "",
        component: Playlists
      },
      {
        path: "albums",
        name: "albums",
        component: Albums
      }
    ]
  },
  {
    path: "/library/albums/:id",
    name: "album",
    alias: ["/library/albums/:id/*", "/library/albums/:id/*/*"],
    component: Album
  },
  {
    path: "/library/artists/:id",
    name: "artist",
    alias: "/library/artists/:id/*",
    component: Artist
  },
  {
    path: "/library/playlists/:id",
    name: "playlist",
    alias: "/library/playlists/:id/*",
    component: Playlist
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
