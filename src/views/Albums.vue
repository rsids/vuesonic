<template>
  <div>
    <h4>Albums</h4>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="albums">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in albums"
          :key="i"
        ></v-s-album-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSAlbumCard from "@/components/AlbumCard";

export default {
  name: "Albums",
  components: { VSAlbumCard },
  data() {
    return {};
  },
  mounted() {
    this.getAlbums();
  },

  computed: {
    ...mapState("album", ["albums"])
  },
  methods: {
    ...mapActions("album", ["getAlbums"])
  }
};
</script>
