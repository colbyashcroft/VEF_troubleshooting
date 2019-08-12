<template>
  <v-container fluid v-if="masterDoc">
    <!-- <drag-helper></drag-helper> -->
    <v-layout column style="position: absolute; top: 0px; left: 0; right: 0; bottom: 0;">
      <v-flex>
        <masterDoc-header></masterDoc-header>
      </v-flex>
      <v-flex xs12 style="position: relative;">
        <v-layout style="position: absolute; top: 0; left: 15px; right: 0; bottom: 0;">
          <v-flex
            shrink
            ref="userInputWrapper"
            class="pr-0 userInput-wrapper"
            style="border-right: 1px solid #d0d0d0; width: 350px; min-width: 350px; overflow-y: auto;"
          >
            <userInput-list></userInput-list>
          </v-flex>
          <v-flex xs12 pl-5 pt-0 style="overflow-y: auto;"> </v-flex>
          <v-flex xl4 lg3 md1> </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MasterDocHeader from './components/MasterDocHeader';
import UserInputList from './components/UserInputList/';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MasterDoc',
  components: { MasterDocHeader, UserInputList },
  data() {
    return {};
  },
  props: ['masterDocId'],
  created() {
    this.subscribeToMasterDoc({ id: this.masterDocId });
  },
  destroyed() {
    this.unsubscribeToMasterDoc();
  },
  computed: {
    ...mapGetters('masterDoc', ['masterDoc'])
  },
  methods: {
    ...mapActions('masterDoc', ['subscribeToMasterDoc', 'unsubscribeToMasterDoc', 'checkMasterDocAuthor']),
  }
};
</script>

<style></style>
