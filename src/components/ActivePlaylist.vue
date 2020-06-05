<template>
  <v-card raised max-width="400">
    <v-img height="100" max-height="100"></v-img>

    <v-data-table
      :hide-default-footer="true"
      class="elevation-1"
      disable-pagination
      :headers="headers"
      :items="songs"
    >
      <template #header.durationFormatted="">
        <v-icon size="medium">mdi-clock-time-four-outline</v-icon>
      </template>
      <template #header.playCount="">
        <v-icon size="medium">mdi-music-note</v-icon>
      </template>
      <template #header.star="">
        <v-icon size="medium">mdi-star</v-icon>
      </template>
      <template #item="item">
        <tr
          @mouseover="onMouseOver(item.item.id)"
          @click="playSong(item.item)"
          @mouseleave="hovered = null"
        >
          <td class="text-center">
            <span v-if="hovered !== item.item.id">
              <span
                v-if="numbering === 'track'"
                v-text="item.item.track"
              ></span>
              <span v-else v-text="songs.indexOf(item.item) + 1"></span>
            </span>
            <v-icon size="28" v-if="hovered === item.item.id">mdi-play</v-icon>
          </td>
          <td>
            <span
              v-text="item.item.title"
              class="text-no-wrap text-truncate"
            ></span>
            <span>
              <span v-text="item.item.artist"></span> -
              <span v-text="item.item.album"></span>
            </span>
          </td>
          <td>
            <span v-text="item.item.durationFormatted"></span>
          </td>
          <td>
            <span v-text="item.item.playCount"></span>
          </td>
          <td class="align-center justify-center text-center">
            <v-icon
              v-if="!item.item.starred && hovered === item.item.id"
              @click.stop="addStar(item.item)"
              >mdi-star-outline</v-icon
            >
            <v-icon
              v-if="!!item.item.starred"
              @click.stop="removeStar(item.item)"
              >mdi-star</v-icon
            >
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "ActivePlaylist"
};
</script>

<style scoped></style>
