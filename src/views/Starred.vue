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

<script lang="ts">
import { mapActions, mapState } from "vuex";
import { noop } from "@/utils/generic";
import VSSonglist from "@/components/Songlist.vue";
import VSSavePlaylist from "@/components/SavePlaylist.vue";
import { Component, Vue } from "vue-property-decorator";
import EmptyState from "@/components/EmptyState.vue";

@Component({
  name: "Playlist",
  components: { VSSavePlaylist, VSSonglist, EmptyState },
  methods: {
    ...mapActions("album", ["getStarred"]),
  },
  computed: {
    ...mapState("album", ["starred"]),
  },
})
export default class Starred extends Vue {
  cover = "";
  getStarred!: () => Promise<unknown>;

  mounted(): void {
    this.getStarred().then(noop);
  }
}
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
