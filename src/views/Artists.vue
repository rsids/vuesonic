<template>
  <div>
    <h3>Artists</h3>
    <v-container fluid>
      <v-row dense align-content="start" justify="start">
        <div class="artist" v-for="(artist, i) in artists" :key="i">
          <v-sheet class="artist__photo ma-4" elevation="4">
            <v-img
              :src="artist.cover"
              max-width="160px"
              max-height="160px"
              aspect-ratio="1"
            >
            </v-img>
          </v-sheet>
          <span class="subtitle-1">{{ artist.name }}</span>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Artists",
  data() {
    return {
      artists: [
        {
          cover: "/mock/cover.webp",
          name: "Koos Alberts"
        },
        {
          cover: "/mock/cover.webp",
          name: "Phil Collins"
        },
        {
          cover: "/mock/cover.webp",
          name: "Adele"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.artist {
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  &__photo {
    border-radius: 80px 80px;
    border: 4px solid white;
    overflow: hidden;
    width: 160px;
    height: 160px;
  }
}
</style>
