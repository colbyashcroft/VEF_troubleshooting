import colors from 'vuetify/es5/util/colors';

export default {
  data() {
    return {
      colors: [
        colors.grey.lighten2,
        colors.red.lighten1,
        colors.red.lighten3,
        colors.grey.base,
        colors.blue.lighten4,
        colors.blue.lighten1
      ]
    };
  },
  computed: {
    answers() {
      return [
        { value: 1, text: ['Probably', 'No'], color: this.colors[1] },
        { value: 2, text: ['Maybe', 'No'], color: this.colors[2] },
        { value: 3, text: ['We Don\x27t', 'Know'], color: this.colors[3] },
        { value: 4, text: ['Maybe', 'Yes'], color: this.colors[4] },
        { value: 5, text: ['Probably', 'Yes'], color: this.colors[5] }
      ];
    }
  }
};
