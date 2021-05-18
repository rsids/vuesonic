import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Albums from "../views/Albums.vue";
import Artists from "../views/Artists.vue";
import Library from "../views/Library.vue";
import Playlists from "../views/Playlists.vue";
import Recent from "../views/Recent.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/library",
    alias: "",
    name: "Music Library",
    component: Library,
    children: [
      {
        path: "recents",
        name: "recents",
        alias: ["", "/recents"],
        component: Recent,
      },
      {
        path: "artists",
        name: "artists",
        component: Artists,
      },
      {
        path: "playlists",
        name: "playlists",
        alias: "",
        component: Playlists,
      },
      {
        path: "albums",
        name: "albums",
        component: Albums,
      },
    ],
  },
  {
    path: "/library/albums/:id",
    name: "album",
    alias: ["/library/albums/:id/*", "/library/albums/:id/*/*"],
    component: () =>
      import(/* webpackChunkName: "album" */ "../views/Album.vue"),
  },
  {
    path: "/library/artists/:id",
    name: "artist",
    alias: "/library/artists/:id/*",
    component: () =>
      import(/* webpackChunkName: "artist" */ "../views/Artist.vue"),
  },
  {
    path: "/library/playlists/:id",
    name: "playlist",
    alias: "/library/playlists/:id/*",
    component: () =>
      import(/* webpackChunkName: "playlist" */ "../views/Playlist.vue"),
  },
  {
    path: "/library/starred",
    name: "starred",
    component: () =>
      import(/* webpackChunkName: "starred" */ "../views/Starred.vue"),
  },
  {
    path: "/search/:query",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/Search.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
