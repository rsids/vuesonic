<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="artists">
        <v-s-artist-card
          v-for="(artist, i) in artists"
          :key="i"
          :artist="artist"
        ></v-s-artist-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSArtistCard from "@/components/ArtistCard";

export default {
  name: "Artists",
  components: { VSArtistCard },
  mounted() {
    this.getArtists();
  },
  computed: {
    ...mapState("artist", ["artists"])
  },
  methods: {
    ...mapActions("artist", ["getArtists"])
  }
};
</script>
