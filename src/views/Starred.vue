<template>
  <div>
    <v-container v-if="starred && starred.length > 0">
      <v-row>
        <v-col cols="12">
          <v-s-songlist
            :songs="starred"
            :full="true"
            :numbering="'index'"
          ></v-s-songlist>
          <v-btn text @click="saveAsPlaylist()">Save as playlist</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-s-empty-state
      v-if="starred && starred.length === 0"
      description="Playlist not found"
      icon="mdi-album"
    ></v-s-empty-state>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { noop } from "@/utils/generic";
import VSEmptyState from "@/components/EmptyState";
import VSSonglist from "@/components/Songlist";

export default {
  name: "Playlist",
  components: { VSSonglist, VSEmptyState },
  data() {
    return {
      cover: ""
    };
  },
  computed: {
    ...mapState("album", ["starred"])
  },
  mounted() {
    this.getStarred().then(noop);
  },
  methods: {
    ...mapActions("album", ["getStarred"]),
    ...mapActions("playlist", ["createPlaylist"]),

    async saveAsPlaylist() {
      const name = await this.$dialog.prompt({
        text: "Save as",
        title: "Enter the name of the playlist"
      });
      if (name) {
        this.createPlaylist({ title: name, songs: this.starred }).then(d => {
          this.$router.push({ name: "playlists" });
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.btn-shuffle {
  padding-left: 0 !important;
  .v-icon {
    padding-right: 8px;
  }
}
.album-title {
  display: inline-block;
  padding-right: 16px;
}
</style>
