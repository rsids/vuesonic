<template>
  <v-container fluid>
    <router-view></router-view>
  </v-container>
</template>

<script>
import { SET_TABS } from "@/store/modules/ui";
import { mapMutations } from "vuex";

export default {
  name: "VSLibrary",
  methods: {
    ...mapMutations("ui", [SET_TABS])
  }
};
</script>
