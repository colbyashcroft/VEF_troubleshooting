import Vue from 'vue';
import dayjs from 'dayjs';

Vue.filter('formatDate', function(value, format) {
  let result;

  if (value) {
    if (format) {
      result = dayjs(value.toDate()).format(format);
    } else {
      result = dayjs(value.toDate()).format('MMMM D, YYYY');
    }
  } else {
    result = '-';
  }
  return result;
});

Vue.filter('truncate', function(value, length = 100) {
  let result;
  if (value) {
    result = value.length > length ? value.slice(0, length) + '...' : value;
  } else {
    result = value;
  }
  return result;
});

Vue.filter('capitalize', function(value) {
  const words = value.split(' ');
  let result = '';
  words.forEach((w, i) => {
    const word = w.slice(0, 1).toUpperCase() + w.slice(1);
    result += word;
    if (i + 1 < words.length) {
      result += ' ';
    }
  });
  return result;
});
