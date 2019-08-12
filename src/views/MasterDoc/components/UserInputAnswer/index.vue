<template>
  <v-menu
    key="authorRating"
    lazy
    @click.native.stop.prevent
    style="display: block;"
    :disabled="disabled"
    :close-on-content-click="false"
  >
    <v-btn
      small
      flat
      :class="{
        'ml-0': true,
        'mr-1': true,
        'pa-0': true,
        'no-events': disabled,
        'author-rating-btn': true
      }"
      slot="activator"
    >
      <answer-icon :userInputAnswer="authorAnswer"></answer-icon>
    </v-btn>
    <author-answer-card v-model="authorAnswer"> </author-answer-card>
  </v-menu>
</template>

<script>
import AnswerIcon from './AnswerIcon';
import AuthorAnswerCard from './AuthorAnswerCard';

import { mapActions } from 'vuex';
export default {
  props: {
    userInput: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: { AnswerIcon, AuthorAnswerCard },
  computed: {
    authorAnswer: {
      get() {
        return this.userInput.authorAnswer;
      },
      set({
        id = this.userInput.id,
        answer = this.authorAnswer.answer,
        confidence = this.authorAnswer.confidence
      }) {
        this.updateuserInputAuthorAnswer({ id, answer, confidence });
      }
    }
  },
  methods: {
    ...mapActions('masterDoc', ['updateuserInputAuthorAnswer'])
  }
};
</script>

<style></style>
