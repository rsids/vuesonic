<template>
  <v-layout wrap align-center column justify-center class="empty-state">
    <v-icon v-text="icon" size="200" color="blue-grey lighten-3"></v-icon>
    <span class="title grey--text">{{ description }}</span>
    <slot></slot>
  </v-layout>
</template>

<script>
export default {
  name: "VSEmptyState",
  props: ["icon", "label", "description"]
};
</script>

<style scoped>
.empty-state {
  padding: 24px 0;
}
</style>
