<template>
  <v-card class="white answer-card pa-1">
    <v-card-text class="pa-1">
      <v-layout row>
        <v-btn-toggle class="answer-btns pa-0" flat v-model="answerAnswer">
          <v-btn
            flat
            class="mx-0"
            v-for="answer in answers"
            :value="answer.value"
            :key="answer.value"
          >
            <v-layout row wrap>
              <v-flex xs12>
                <svg width="18" height="18">
                  <circle
                    :stroke="answer.color"
                    stroke-width="2"
                    :fill="hasFill ? answer.color : 'none'"
                    r="8"
                    cx="9"
                    cy="9"
                  ></circle>
                </svg>
              </v-flex>
              <v-flex xs12 class="answer-title">
                <div>{{ answer.text[0] }}<br />{{ answer.text[1] }}</div>
              </v-flex>
            </v-layout>
          </v-btn>
        </v-btn-toggle>
      </v-layout>
      <v-divider class="py-2"></v-divider>
      <v-layout row>
        <v-btn-toggle class="confidence-btns pa-0" flat v-model="confidenceAnswer">
          <v-btn flat class="mx-0" :value="1">
            <svg width="30" height="30">
              <circle :stroke="color" stroke-width="2" fill="none" r="14" cx="15" cy="15"></circle>
            </svg>
            <div class="answer-title pl-2">...but not sure yet</div>
          </v-btn>
          <v-btn flat class="mx-0" :value="2">
            <svg width="30" height="30"><circle :fill="color" r="14" cx="15" cy="15"></circle></svg>
            <div class="answer-title pl-2">...and I'm pretty sure</div>
          </v-btn>
        </v-btn-toggle>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import authorAnswerColors from './mixins/authorAnswerColors';

export default {
  props: ['value'],
  mixins: [authorAnswerColors],
  computed: {
    color() {
      return this.answerAnswer ? this.colors[this.answerAnswer] : this.colors[0];
    },
    hasFill() {
      return !this.answerAnswer || this.confidenceAnswer == 2;
    },
    answerAnswer: {
      set: function(v) {
        return this.$emit('input', { answer: v });
      },
      get: function() {
        return this.value.answer;
      }
    },
    confidenceAnswer: {
      set: function(v) {
        return this.$emit('input', { confidence: v });
      },
      get: function() {
        return this.value.confidence;
      }
    }
  }
};
</script>

<style scoped>
.answer-btns .v-btn {
  height: 80px !important;
}

.answer-btns {
  box-shadow: none;
}

.answer-title {
  font-size: 12px;
}

.confidence-btns {
  box-shadow: none;
  width: 100%;
}

.confidence-btns .v-btn {
  height: 50px !important;
  width: 50%;
}
</style>
