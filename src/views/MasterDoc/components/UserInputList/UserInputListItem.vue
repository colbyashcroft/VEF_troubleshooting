<template>
  <div
    :class="{
      'pl-4': item.type == 3,
      'list-item-container': true
    }"
    style="position: relative;"
  >
    <div
      :key="item.id"
      tabindex="0"
      ref="listItem"
      class="list-item"
      @mouseover="!dragging && !animating ? (hovering = true) : null"
      @mouseleave="hovering = false"
      @keydown.up.exact="!editing ? selectuserInputItemByOrder(-1) : true"
      @keydown.down.exact="!editing ? selectuserInputItemByOrder(1) : true"
      @keydown.tab.exact.prevent="tabToPage"
      @keydown.shift.tab.exact.prevent
      @keydown.enter.exact.self.prevent="enableEditing"
      @keydown.ctrl.enter.prevent.exact.self="createNewItem(true)"
      @click.exact="selectListItem"
      @dblclick="enableEditing"
      @keydown.ctrl.right.exact.self="userInputType = item.type + 1"
      @keydown.ctrl.left.exact.self="userInputType = item.type - 1"
      @keydown.ctrl.down.exact.prevent="moveSortItem(1)"
      @keydown.ctrl.up.exact.prevent="moveSortItem(-1)"
      @keydown.delete.exact.self="!editing ? tryDeleteItem() : true"
      @keydown.shift.up="advanceHighlightuserInput(-1)"
      @keydown.shift.down="advanceHighlightuserInput(1)"
      @keydown.exact="handleVote"
      @mousedown.shift.stop.prevent="highlightuserInputs"
    >
      <v-layout>
        <v-flex
          xs12
          :class="{
            'userInput-list-item': true,
            'pl-0': true,
            'section-item': item.type == 1,
            editing: editing,
            grey: hovering || highlighted || selected || editing,
            'lighten-2': selected && !editing,
            'lighten-4': hovering || highlighted,
            'lighten-5': editing
          }"
        >
          <v-layout>
            <v-btn icon small class="mx-0 my-0" :disabled="dragging">
              <v-icon
                v-show="hovering"
                color="grey lighten-1"
                small
                @mousedown="dragStart"
                @mouseup="dragStop"
                @click.stop
                >drag_indicator</v-icon
              >
            </v-btn>
            <v-flex>
              <v-layout column>
                <content-editor
                  :id="`editor-${item.id}`"
                  ref="editor"
                  :preventDefaultCtrl="true"
                  :placeholder="
                    item.type == 1
                      ? 'Add a section title'
                      : item.type == 2
                      ? 'Add a userInput'
                      : 'Add a sub userInput'
                  "
                  :class="{
                    'text-line': item.type != 1,
                    'section-title': item.type == 1,
                    'pr-2': item.type != 1,
                    'py-1': true,
                    'grey--text': true,
                    'purple--text': true,
                    'text--darken-1': !selected && item.type != 1,
                    'text--darken-3': !selected && item.type == 1,
                    'text--darken-4': selected
                  }"
                  :style="
                    `${!editing ? 'pointer-events: none;' : ''}
                      ${item.type == 1 ? 'font-size: 16px; font-weight: 600;' : ''}'`
                  "
                  v-model="itemText"
                  @blur="stopEditing"
                  @keyEnter="stopEditing"
                  @keyEsc="stopEditing"
                  @keyCtrlEnter="createNewItem(false)"
                  @keyCtrlRight="userInputType = item.type + 1"
                  @keyCtrlLeft="userInputType = item.type - 1"
                  @keydown.ctrl.down.exact.prevent="moveSortItem(1)"
                  @keydown.ctrl.up.exact.prevent="moveSortItem(-1)"
                  @keyBackspaceEmpty="tryDeleteItem"
                  @keydown.up.stop
                  @keydown.down.stop
                  :disabled="!editing"
                >
                </content-editor>
                <v-btn-toggle
                  v-if="editing"
                  v-model="userInputType"
                  mandatory
                  class="elevation-0 transparent"
                >
                  <v-btn small flat :value="1">
                    <span style="text-decoration: underline; font-weight: bold;">S</span>
                  </v-btn>
                  <v-btn small flat :value="2">
                    <span style="font-weight: bold;">Q</span>
                  </v-btn>
                  <v-btn small flat :value="3">
                    <span style="text-decoration: overline; font-size: 0.9em; font-weight: bold;"
                      >Q</span
                    >
                  </v-btn>
                </v-btn-toggle>
                <div v-else-if="item.type != 1" class="">
                  <userInput-answer :userInput="item"></userInput-answer>
                </div>
              </v-layout>
            </v-flex>
            <template v-if="!editing">
              <v-btn icon small class="mb-0 mx-0 mt-1" @click.stop="createNewItem(true)">
                <v-icon v-show="!editing && hovering" small>add</v-icon>
              </v-btn>
              <v-btn
                :disabled="!hasChildren"
                icon
                small
                class="mb-0 mt-1 ml-0 mr-1"
                @click.stop="toggleChildren"
                @dblclick.stop
              >
                <v-icon
                  v-show="hasChildren"
                  icon
                  small
                  :style="!showChildren ? 'transform: rotate(90deg)' : null"
                >
                  keyboard_arrow_down
                </v-icon>
              </v-btn>
            </template>
            <template v-else>
              <v-btn icon small class="mb-0 mx-0 mt-1" @click.stop="stopEditing">
                <v-icon small>check</v-icon>
              </v-btn>
              <v-btn icon small class="mb-0 mx-0 mt-1" @click.stop="tryDeleteItem">
                <v-icon small>delete</v-icon>
              </v-btn>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div
      v-if="!showChildren"
      class="ma-0 pr-2  px-1 grey--text lighten-4 grey text--lighten-0"
      style="font-size: 11px; display: block; text-align: right; cursor: pointer;"
      @click.stop="toggleChildren"
    >
      {{ children.length }} Hidden userInput{{ children.length == 1 ? '' : 's' }}
    </div>
    <v-btn
      v-if="item.type == 1 && !hasChildren"
      block
      flat
      small
      class="grey--text text--lighten-2"
      @click.stop="createNewItem(true)"
      >Add userInputs</v-btn
    >
  </div>
</template>

<script>
import ContentEditor from '../ContentEditor';
import userInputAnswer from '../UserInputAnswer';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  props: ['item'],
  components: { ContentEditor, userInputAnswer },
  data() {
    return {
      hovering: false,
      showChildren: true
    };
  },
  computed: {
    ...mapGetters('masterDoc', ['userInputs']),
    ...mapState('views/masterDoc', [
      'dragging',
      'animating',
      'editinguserInputId',
      'selectedPageId',
      'highlightedItems',
      'focusTo'
    ]),
    itemText: {
      set(v) {
        this.updateuserInputText({ id: this.item.id, text: v });
      },
      get() {
        return this.item.text;
      }
    },
    userInputType: {
      set(type) {
        console.log(type);
        if (type < 1 || type > 3) {
          //  type is already maxed, do nothing
          return;
        }
        this.updateuserInputType({ id: this.item.id, type });
      },
      get() {
        return this.item.type;
      }
    },
    editing: {
      get() {
        //  returns true if item is being edited
        return this.editinguserInputId == this.item.id;
      },
      set(v) {
        //  set editingItem to id
        this.setEditinguserInputId(v);
      }
    },
    selected: {
      get() {
        //  returns true if page is selected
        return this.selectedPageId == this.item.id;
      },
      set(v) {
        this.setHighlightedItems();
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
    highlighted() {
      return this.highlightedItems.includes(this.item.id);
    },
    hasChildren() {
      const next = this.item.type == 1 && this.userInputs[this.item.order + 1];
      return next && next.type != 1;
    },
    children() {
      let children = [];
      if (this.hasChildren) {
        //  find next section
        let nextSection;

        if (this.item.type == 1) {
          //  find next section
          nextSection = this.userInputs.find(q => q.order > this.item.order && q.type == 1);
          console.log(nextSection);
        }
        const nextIndex = nextSection ? nextSection.order : this.userInputs.length;
        children = this.userInputs.filter(q => q.order > this.item.order && q.order < nextIndex);
      }
      return children;
    }
  },
  watch: {
    selected: function(n, o) {
      //  if we are going from false to true focus
      console.log('fcus from watch');
      if (n && !o) {
        this.$refs.listItem.focus();
      }
    },
    focusTo: function(n, o) {
      //  if we are going from false to true focus
      if (n == 'listItem' + this.item.id) {
        console.log('focus to list item');
        this.$refs.listItem.focus();
      }
    }
  },
  methods: {
    ...mapActions('masterDoc', [
      'adduserInput',
      'removeuserInput',
      'updateuserInputText',
      'updateuserInputType',
      'moveuserInputsByOrder'
    ]),
    ...mapMutations('views/masterDoc', [
      'setHoveringItem',
      'setEditinguserInputId',
      'setSelectedPageId',
      'addItemToHighlightedItems',
      'removeItemFromHighlightedItems',
      'setHighlightedItems',
      'setFocusTo'
    ]),
    selectuserInputItemByOrder(v) {
      console.log('select userInput');
      if (v < 0 && this.item.order == 0) {
        //  we want to go to the masterDoc title
        this.selected = 'masterDocTitle';
      } else {
        const index = this.item.order + v;
        const next = this.userInputs[index];
        if (next) {
          this.selected = next.id;
        }
      }
    },
    toggleChildren() {
      if (this.showChildren) {
        this.showChildren = false;
        this.$emit('hideChildren', this.children.map(c => c.id));
      } else {
        this.showChildren = true;
        this.$emit('showChildren', this.children.map(c => c.id));
      }
    },
    selectListItem() {
      console.log('seelct list item')
      this.selected = this.item.id;
      if (!this.editing && this.editinguserInputId) {
        this.editing = false;
      }
    },
    tabToPage() {
      this.setFocusTo('page');
      //  Focus on page content
    },
    enableEditing() {
      this.editing = this.item.id;
      //  focus the editor
      this.$nextTick(() => {
        this.$refs.editor.focus();
      });
    },
    stopEditing() {
      this.editing = '';
      this.$refs.listItem.focus();
    },
    async createNewItem(child) {
      const itemType = this.item.type;
      const type = child && itemType != 3 ? itemType + 1 : itemType;
      const args = { text: '', order: this.item.order + 1, type };
      if (!this.showChildren) {
        this.toggleChildren();
      }
      const id = await this.adduserInput(args);
      this.$nextTick(() => {
        this.selected = id;
        this.$emit('focusEdit', id);
      });
    },
    handleVote() {
    },
    tryDeleteItem() {
      //  TODO: Check if we should do this
      console.log('delete');
      if (this.userInputs[this.item.order + 1]) {
        this.selectuserInputItemByOrder(1);
      } else {
        this.selectuserInputItemByOrder(-1);
      }
      this.removeuserInput({ id: this.item.id });
    },
    dragStart() {},
    dragStop() {},
    moveSortItem(v) {
      // console.log(v);
      this.moveuserInputsByOrder({
        ordersToMove: [this.item.order
          // + 1 - 1
        ],
        moveLocation: this.item.order + v
      });
      this.$nextTick(() => {
        this.$refs.listItem.focus();
      });
    },
    highlightuserInputs() {
      const item = this.item;
      const startItem = this.userInputs.find(i => i.id == this.selectedPageId);
      if (!startItem) {
        return;
      }
      let items;
      if (startItem.order < item.order) {
        items = this.userInputs.slice(startItem.order + 1, item.order + 1);
        items = items.sort((a, b) => {
          return a.order + b.order;
        });
      } else {
        items = this.userInputs.slice(item.order, startItem.order);
      }
      items = items.map(i => i.id);
      this.setHighlightedItems(items);
    },
    advanceHighlightuserInput(pos) {
      const item = this.item;
      const highlighted = this.highlightedItems;
      const hLength = highlighted.length;
      let next;

      if (!hLength) {
        //  none selected yet, select next
        next = this.userInputs[item.order + pos];
        if (next) {
          this.addItemToHighlightedItems(next.id);
        }
      } else {
        //  Check if we are going in the right direction
        const lastItem = this.userInputs.find(q => q.id == highlighted[hLength - 1]);
        if ((pos > 0 && item.order < lastItem.order) || (pos < 0 && item.order > lastItem.order)) {
          next = this.userInputs[lastItem.order + pos];
          if (next) {
            this.addItemToHighlightedItems(next.id);
          }
        } else {
          //  remove the last item
          this.removeItemFromHighlightedItems(highlighted[hLength - 1]);
        }
      }
    }
  }
};
</script>

<style>
.text-line {
  display: inline-block;
  font-size: 16px;
  min-width: 100px;
  min-height: 10px;
}

.userInput-list-item {
  position: relative;
  width: 100%;
  transition: 0.1s ease background-color;
  cursor: pointer;
  border-radius: 2px 0 0 2px;
}

.userInput-list-item.hover,
.home:hover {
  background: #e1e1e1;
}

.section-item {
  border-bottom: 1px solid #eee;
}

.text-line p,
.section-title p {
  margin-bottom: 0px;
}
</style>
