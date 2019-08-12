<template>
  <div
    tabindex="0"
    ref="masterDocTitle"
    :id="id"
    class="list-item"
    @mouseover="!dragging && !animating ? (hovering = id) : null"
    @mouseout="hovering = ''"
    @keydown.down.exact="!editing ? (selected = userInputs[0].id) : true"
    @keydown.tab.exact.prevent="tabToPage"
    @keydown.enter.exact.self.prevent="enableEditing"
    @keydown.shift.tab.exact.prevent
    @keydown.up.exact.stop
    @click.exact="selectListItem"
    @dblclick="enableEditing"
  >
    <v-layout>
      <v-flex
        xs12
        :class="{
          'userInput-list-item': true,
          editing: !!editing,
          outline: selected && !editing,
          'pl-1': true,
          'lighten-2': selected && !editing,
          'lighten-4': hovering,
          'lighten-5': editing
        }"
      >
        <v-layout>
          <v-flex>
            <content-editor
              :id="`editor-masterDocTitle`"
              ref="editor"
              :class="{
                'section-title': true,
                'py-1': true,
                'grey--text': !hovering && !selected && !editing,
                'blue--text': hovering || selected || editing,
                'text--lighten-1': hovering && !selected,
                'text--darken-1': selected || (!hovering && !editing)
              }"
              style="font-size: 42px; font-weight: 300; padding-left: 40px;"
              v-model="masterDocTitle"
              :placeholder="'MasterDoc topic'"
              :preventDefaultCtrl="true"
              :disabled="!editing"
              @blur="editing = false"
              @focus="enableEditing"
              @keyCtrlEnter="createNewItem"
              @keyEnter="editing = false"
              @keyEsc="editing = false"
              @keydown.up.stop
              @keydown.down.stop
            >
            </content-editor>
          </v-flex>
          <v-btn :disabled="editing" icon small class="mb-0 mx-0 mt-1" @click.stop="enableEditing">
            <v-icon v-show="!editing && hovering" icon small>edit</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import ContentEditor from '../ContentEditor';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      id: 'masterDocTitle',
      hovering: false,
    };
  },
  components: { ContentEditor },
  computed: {
    ...mapGetters('masterDoc', ['masterDoc', 'userInputs']),
    ...mapState('views/masterDoc', [
      'dragging',
      'animating',
      'hoveringItem',
      'editinguserInputId',
      'selectedPageId',
      'focusTo'
    ]),
    editing: {
      get() {
        //  returns true if item is being edited
        return this.editinguserInputId == this.id;
      },
      set(v) {
        //  set editingItem to id
        this.setEditinguserInputId(v);
      }
    },
    selected: {
      get() {
        //  returns true if page is selected
        return this.selectedPageId == this.id;
      },
      set(v) {
        this.setSelectedPageId(v);
      }
    },
    // hovering: {
    //   get() {
    //     //  return the getter or state for hoveringItem
    //     return this.hoveringItem == this.id;
    //   },
    //   set(v) {
    //     //  call mutation or action to set hoveringItem
    //     this.setHoveringItem(v);
    //   }
    // },
    masterDocTitle: {
      get() {
        //  return the masterDoc title
        return this.masterDoc.text;
      },
      set(v) {
        //  update the masterDoc title
        this.updateMasterDocText({ text: v });
      }
    }
  },
  watch: {
    selected: function(n, o) {
      //  if we are going from false to true focus
      if (n && !o) {
        this.$refs.masterDocTitle.focus();
      }
    },
    focusTo: function(n) {
      //  if we are going from false to true focus
      if (n == 'listItemMasterDocTitle') {
        console.log('focus to list item');
        this.$refs.masterDocTitle.focus();
      }
    }
  },
  methods: {
    ...mapActions('masterDoc', ['updateMasterDocText']),
    ...mapMutations('views/masterDoc', [
      'setHoveringItem',
      'setEditinguserInputId',
      'setSelectedPageId',
      'setFocusTo'
    ]),
    selectListItem() {
      this.selected = this.id;
    },
    tabToPage() {
      //  Focus on page content
      this.setFocusTo('page');
    },
    enableEditing() {
      this.editing = 'masterDocTitle';
      //  focus the editor
      this.$refs.editor.focus();
    },
    createNewItem() {
      //const args = { text, order, type };
    }
  }
};
</script>

<style>
.userInput-list-item {
  position: relative;
  width: 100%;
  transition: 0.1s ease background-color;
  cursor: pointer;
  border-radius: 2px 0 0 2px;
}
</style>
