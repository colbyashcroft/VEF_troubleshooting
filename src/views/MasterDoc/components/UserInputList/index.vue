<template>
  <transition-group
    name="flip-list"
    v-on:before-enter="setAnimating(true)"
    v-on:after-enter="setAnimating(false)"
    v-on:before-leave="setAnimating(true)"
    v-on:after-leave="setAnimating(false)"
  >
    <v-btn
      v-if="!userInputs.length"
      key="NewuserInputBtn"
      block
      flat
      small
      class="grey--text text--lighten-2"
      @click.stop="createNewItem"
      >Add userInputs</v-btn
    >
    <userInput-list-item
      v-for="item in filtereduserInputs"
      :item="item"
      :key="item.id"
      :ref="item.id"
      @focusEdit="focusEdit"
      @hideChildren="hideChildren"
      @showChildren="showChildren"
    ></userInput-list-item>
  </transition-group>
</template>

<script>
import userInputListItem from './UserInputListItem';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: { userInputListItem },
  data() {
    return {
      childrenToHide: []
    };
  },
  computed: {
    ...mapGetters('masterDoc', ['userInputs']),
    ...mapState('views/masterDoc', ['selectedPageId']),
    filtereduserInputs() {
      return this.userInputs.filter(q => !this.childrenToHide.includes(q.id));
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleBackgroundKeyEvents);
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleBackgroundKeyEvents);
  },
  methods: {
    ...mapMutations('views/masterDoc', ['setAnimating', 'setSelectedPageId']),
    ...mapActions('masterDoc', ['adduserInput']),
    focusEdit(id) {
      console.log(id);
      this.$nextTick(() => {
        this.$refs[id][0].enableEditing();
      });
    },
    hideChildren(items) {
      console.log(items);
      this.childrenToHide = this.childrenToHide.concat(items);
    },
    showChildren(items) {
      this.childrenToHide = this.childrenToHide.filter(c => !items.includes(c));
    },
    async createNewItem() {
      const type = 2;
      const args = { text: '', order: 0, type };
      const id = await this.adduserInput(args);
      console.log(id);
      this.$nextTick(() => {
        this.setSelectedPageId(id);
        this.focusEdit(id);
      });
    },
    handleBackgroundKeyEvents(e) {
      //  handle global up/down if active element is body
      try {
        if (!this.editing && document.activeElement.tagName == 'BODY') {
          if ((e.which == 40 || e.which == 38) && (!e.ctrlKey && !e.shiftKey)) {
            console.log('handle bg key event')
            console.log(e);
            //  keydown
            let next;
            const dir = e.which == 40 ? 1 : -1;
            if (!this.selectedPageId) {
              next = { id: 'masterDocTitle' };
            } else if (this.selectedPageId == 'masterDocTitle') {
              next = dir > 0 ? this.userInputs[0] : false;
            } else {
              const selected = this.userInputs.find(q => q.id == this.selectedPageId);
              if (selected.order == 0 && dir < 0) {
                next = { id: 'masterDocTitle' };
              } else {
                next = this.userInputs.find(q => q.order == selected.order + dir);
              }
            }
            if (next) {
              this.setSelectedPageId(next.id);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style>
.flip-list-move {
  transition: transform 0.3s, padding-left 0.3s;
}

.list-item-container {
  transition: padding-left 0.3s, transform 0.3s;
}

.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.flip-list-leave-active {
  position: absolute !important;
}
</style>
