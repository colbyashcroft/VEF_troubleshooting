<template>
  <svg width="60" height="12">
    <circle
      v-for="answer in answers"
      :key="answer.value"
      :stroke="userInputAnswer.answer == answer.value ? color : colors[0]"
      :fill="userInputAnswer.answer == answer.value ? (hasFill ? color : 'none') : colors[0]"
      stroke-width="2"
      r="4"
      :cx="(answer.value - 1) * 11 + 5"
      cy="5"
    ></circle>
  </svg>
</template>

<script>
import authorAnswerColors from './mixins/authorAnswerColors';
export default {
  props: ['userInputAnswer', 'show'],
  mixins: [authorAnswerColors],
  computed: {
    color() {
      return this.userInputAnswer.answer ? this.colors[this.userInputAnswer.answer] : this.colors[0];
    },
    hasFill() {
      return !this.userInputAnswer.answer || this.userInputAnswer.confidence == 2;
    }
  }
};
</script>
