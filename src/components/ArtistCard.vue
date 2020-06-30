<template>
  <div class="artist" @click="gotoArtist()">
    <v-sheet class="artist__photo ma-4" elevation="4">
      <v-s-cover :entity="artist" type="artist" :size="160"></v-s-cover>
    </v-sheet>
    <span
      class="subtitle-1 text-no-wrap text-truncate"
      style="max-width: 160px"
      >{{ artist.name }}</span
    >
  </div>
</template>

<script>
import { Artist } from "@/store/interfaces/artist";
import VSCover from "@/components/Cover";
import { mapActions } from "vuex";

export default {
  name: "VSArtistCard",
  components: { VSCover },
  props: {
    artist: Artist
  },

  methods: {
    ...mapActions("album", ["cancelAllRequests"]),
    gotoArtist() {
      this.cancelAllRequests();
      this.$router.push(this.artistUrl);
    }
  },

  computed: {
    artistUrl() {
      if (this.artist) {
        const artist = encodeURIComponent(
          this.artist.name.split(" ").join("-")
        );
        return `/library/artists/${this.artist.id}/${artist}`;
      }
      return undefined;
    }
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
