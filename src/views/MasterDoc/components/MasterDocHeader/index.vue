<template>
  <v-layout>
    <v-flex xs6 class="mb-0 grey--text text--darken-3">
      <masterDoc-header-title></masterDoc-header-title>
    </v-flex>
    <v-flex xs6 class="mb-0 grey--text text--darken-3">
      <!-- <resource-widget></resource-widget>
      <discussion-widget></discussion-widget> -->
    </v-flex>
  </v-layout>
</template>

<script>
import MasterDocHeaderTitle from './MasterDocHeaderTitle';
export default {
  name: 'MasterDocHeader',
  components: { MasterDocHeaderTitle }
};
</script>

<style></style>
