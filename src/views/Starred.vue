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
          <v-s-save-playlist
            label="Save as playlist"
            :songs="starred"
          ></v-s-save-playlist>
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
import VSSavePlaylist from "@/components/SavePlaylist";

export default {
  name: "Playlist",
  components: { VSSavePlaylist, VSSonglist, VSEmptyState },
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
    ...mapActions("album", ["getStarred"])
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
