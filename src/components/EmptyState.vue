<template>
  <v-layout wrap align-center column justify-center class="empty-state">
    <v-icon v-text="icon" size="200" color="blue-grey lighten-3"></v-icon>
    <span class="title grey--text">{{ description }}</span>
    <slot></slot>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "VSEmptyState",
})
export default class EmptyState extends Vue {
  @Prop() icon!: string;
  @Prop() description!: string;
}
</script>

<style scoped>
.empty-state {
  padding: 24px 0;
}
</style>
