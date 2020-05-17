<template>
  <div>
    <h4>Playlists</h4>
    <v-container fluid>
      <v-row dense align-content="start" justify="start">
        <v-card
          class="ma-3"
          v-for="(playlist, i) in playlists"
          :key="i"
          width="200px"
          max-width="200px"
        >
          <v-img
            :src="playlist.cover"
            max-width="200px"
            max-height="200px"
            aspect-ratio="1"
          >
          </v-img>
          <v-card-title
            class="text-no-wrap subtitle-1"
            v-text="playlist.title"
          ></v-card-title>
          <v-card-subtitle v-text="playlist.subtitle"></v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Playlists",
  data() {
    return {
      playlists: [
        {
          cover: "/mock/cover.webp",
          title: "Thumbs up",
          subtitle: "Auto-playlist"
        },
        {
          cover: "/mock/cover.webp",
          title: "Last added",
          subtitle: "Auto-playlist"
        },
        {
          cover: "/mock/cover.webp",
          title: "Free and purchased",
          subtitle: "Auto-playlist"
        }
      ]
    };
  }
};
</script>
