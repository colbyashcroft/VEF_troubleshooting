<template>
  <v-avatar :size="size">
    <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
    <v-icon v-else size="30">account_circle</v-icon>
  </v-avatar>
</template>

<script>
export default {
  name: 'user-avatar',
  props: ['size', 'avatarUrl'],
  data() {
    return {};
  }
};
</script>
