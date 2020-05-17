<template>
  <v-container fluid>
    <h2>Recently played or added</h2>
    <v-container fluid>
      <v-row dense align-content="start" justify="start" v-if="recents">
        <v-s-album-card
          :album="album"
          v-for="(album, i) in recents"
          :key="i"
        ></v-s-album-card>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VSAlbumCard from "@/components/AlbumCard";
import { noop } from "@/utils/generic";

export default {
  name: "VSRecent",
  components: { VSAlbumCard },
  computed: {
    ...mapState("album", ["recents"])
  },
  methods: {
    ...mapActions("album", ["getRecents"])
  },
  mounted() {
    this.getRecents().then(noop);
  }
};
</script>
