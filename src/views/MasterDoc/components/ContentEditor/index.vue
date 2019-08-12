<template>
  <div ref="editor"></div>
</template>

<script>
import Quill from 'quill';
import Delta from 'quill-delta';
//import MagicUrl from 'quill-magic-url';

//Quill.register('modules/magicUrl', MagicUrl);

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    allowFormats: {
      type: Boolean,
      default: false
    },
    allowMarkdown: {
      type: Boolean,
      default: false
    },
    allowEnterMoveText: {
      type: Boolean,
      default: false
    },
    allowTraversal: {
      type: Boolean,
      default: false
    },
    preventDefaultCtrl: {
      type: Boolean,
      default: false
    },
    enableMagicUrl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    value(val) {
      if (val != this.editor.root.innerHTML && !this.editor.hasFocus()) {
        //  this.editor.clipboard.dangerouslyPasteHTML(val, 'silent');
        const delta = this.editor.clipboard.convert(val);
        this.editor.setContents(delta, 'silent');
      }
    },
    disabled(status) {
      this.editor.enable(!status);
    },
    placeholder(v) {
      this.editor.root.setAttribute('data-placeholder', v);
    }
  },
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      formats: this.allowFormats ? this.formats : [],
      placeholder: this.placeholder,
      modules: {
        toolbar: false,
        //magicUrl: this.enableMagicUrl,
        keyboard: {
          bindings: {
            ctrlEnter: {
              key: 13,
              ctrlKey: true,
              handler: () => {
                this.$emit('keyCtrlEnter');
              }
            },
            enter: {
              key: 13,
              handler: (range, masterDoc) => {
                if (this.allowEnterMoveText) {
                  const enterPoint = masterDoc.offset;
                  const remaining = this.editor.getLength() - enterPoint;
                  const delta = remaining ? this.editor.getContents(enterPoint) : false;
                  this.$emit('keyEnter', delta);
                  if (remaining) {
                    //  we hit enter in the middle of a line, delete the rest of the line, we will move it to the next
                    this.editor.updateContents(new Delta().retain(enterPoint).delete(remaining));
                  }
                } else {
                  this.$emit('keyEnter');
                }
              }
            },
            escape: {
              key: 27,
              handler: () => {
                this.editor.setSelection(0);
                this.$emit('keyEsc');
              }
            },
            tab: {
              key: 9,
              shiftKey: false,
              handler: () => {
                this.$emit('keyTab');
                return false;
              }
            },
            shiftTab: {
              key: 9,
              shiftKey: true,
              handler: () => {
                this.$emit('keyShiftTab');
                return false;
              }
            },
            ctrlRight: {
              key: 39,
              ctrlKey: true,
              handler: () => {
                this.$emit('keyCtrlRight');
                if (!this.preventDefaultCtrl) {
                  return true;
                }
              }
            },
            ctrlLeft: {
              key: 37,
              ctrlKey: true,
              handler: () => {
                this.$emit('keyCtrlLeft');
                if (!this.preventDefaultCtrl) {
                  return true;
                }
              }
            },
            arrowLeft: {
              key: 37,
              ctrlKey: false,
              offset: 0,
              handler: () => {
                this.$emit('keyLeftFirstChar');
              }
            },
            arrowRight: {
              key: 39,
              ctrlKey: false,
              suffix: /^$/,
              handler: () => {
                this.$emit('keyRightLastChar');
              }
            },
            arrowDown: {
              key: 40,
              handler: (range, masterDoc) => {
                if (this.allowTraversal) {
                  const bounds = this.editor.getBounds(range.index);
                  const isLastLine = this.$refs.editor.offsetHeight - bounds.bottom < 10;
                  if (isLastLine) {
                    const args = { masterDoc, range, bounds };
                    this.$emit('keyDownLastLine', args);
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return true;
                }
              }
            },
            arrowUp: {
              key: 38,
              handler: (range, masterDoc) => {
                if (this.allowTraversal) {
                  const bounds = this.editor.getBounds(range.index);
                  // console.log(bounds);
                  const isFirstLine = bounds.top < 10;
                  if (isFirstLine) {
                    const args = { masterDoc, range, bounds };
                    this.$emit('keyUpFirstLine', args);
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return true;
                }
              }
            },
            backspace: {
              key: 8,
              handler: range => {
                if (range.index == 0 && this.editor.getLength() == 1) {
                  this.$emit('keyBackspaceEmpty');
                  return false;
                } else if (range.index == 0 && range.length == 0) {
                  const delta = this.editor.getLength() > 1 ? this.editor.getContents() : false;
                  this.$emit('keyBackspaceFirstChar', delta);
                  return false;
                }
                return true;
              }
            },
            deleteLastChar: {
              key: 46,
              suffix: /^$/,
              handler: range => {
                if (range.length == 0) {
                  const delta = this.editor.getLength() > 1 ? this.editor.getContents() : false;
                  this.$emit('keyDeleteLastChar', delta);
                  return false;
                } else {
                  return true;
                }
              }
            },
            //  Handle markdown shortcodes
            // # to H1
            markdownHeader: {
              key: 32, // space
              offset: 1,
              shiftKey: null,
              prefix: /^#$/,
              handler: (range, masterDoc) => {
                if (!this.allowMarkdown) {
                  return true;
                }
                console.log('h1');
                console.log(range);
                console.log(masterDoc);
                this.editor.formatLine(range.index, 1, 'header', '1');
                this.editor.deleteText(range.index - 1, 1);
              }
            },
            'header enter': {
              // overwrite quills default behavior here
              key: 'Enter',
              handler: (range, masterDoc) => {
                console.log('header enter');
                this.$emit('keyEnter', false);
              }
            },
            markdownHeader2: {
              key: 32, // space
              offset: 2,
              shiftKey: null,
              prefix: /^##$/,
              handler: (range, masterDoc) => {
                if (!this.allowMarkdown) {
                  return true;
                }
                this.editor.formatLine(range.index, 1, 'header', 'h2');
                this.editor.deleteText(range.index - 2, 2);
              }
            }
          }
        }
      },
      readOnly: this.disabled ? this.disabled : false
    });

    const startingDelta = this.editor.clipboard.convert(this.value);
    this.editor.setContents(startingDelta, 'silent');

    this.editor.on('text-change', (delta, oldDelta, source) => {
      if (source != 'silent') {
        //  TODO: maybe if source is user and debounce on we debounce this?
        this.update();
      }
    });

    this.editor.on('selection-change', (range, oldRange, source) => {
      console.log('selection change');
      console.log(source);
      if (range === null && oldRange !== null) {
        console.log('blur selection change');
        this.blur();
      } else {
        if (range.length == 0) {
          console.log('User cursor is on', range.index);
        }
        if (!oldRange && !this.disabled) {
          console.log('focus');
          this.$emit('focus');
        }
      }
    });
  },
  beforeDestroy() {
    this.editor = null;
    delete this.editor;
  },
  methods: {
    update() {
      this.$emit('input', this.editor && this.editor.getText() ? this.editor.root.innerHTML : '');
    },
    setContents(delta) {
      this.editor.setContents(delta);
    },
    getContents() {
      return this.editor.getContents();
    },
    updateContents(delta) {
      //const currentDelta = this.editor.getContents();
      const oldDelta = new Delta().retain(this.editor.getLength() - 1).delete(1);
      const newDelta = delta ? oldDelta.concat(delta) : oldDelta;
      this.editor.updateContents(newDelta);
    },
    focus(selectAll = false) {
      //this.editor.focus();
      const length = this.editor.getLength();
      if (length > 1 && selectAll) {
        // highlight the text
        this.editor.setSelection(0, length);
      } else {
        // just focus the input
        this.editor.focus();
      }
    },
    setCaret({ prevLeft, direction = 'down' }) {
      const newIndex = this.findIndex(prevLeft, direction);
      this.editor.setSelection(newIndex);
    },
    blur() {
      this.$emit('blur');
    },
    findIndex(left, direction = 'down') {
      let dist;
      let oldDist;
      let length = this.editor.getLength();
      let i = 0;
      if (direction == 'down') {
        while (i < length) {
          let bounds = this.editor.getBounds(i);
          dist = Math.abs(bounds.left - left);
          if (!isNaN(oldDist) && oldDist < dist) {
            i--;
            break;
          } else {
            oldDist = dist;
            i++;
          }
        }
      } else {
        i = length - 1;
        while (i >= 0) {
          let bounds = this.editor.getBounds(i);
          dist = Math.abs(bounds.left - left);
          if (!isNaN(oldDist) && oldDist < dist) {
            i++;
            break;
          } else {
            oldDist = dist;
            i--;
          }
        }
      }

      return i;
    }
  }
};
</script>

<style>
.ql-editor.ql-blank::before {
  color: rgba(0, 0, 0, 0.4);
  content: attr(data-placeholder);
  font-style: none;
  pointer-events: none;
  position: absolute;
}

[contenteditable='true']:empty::before {
  content: attr(placeholder);
  opacity: 0.2;
}

.ql-editor {
  min-height: auto;
  font-size: inherit;
  border: none;
  outline: none;
  padding: 0px;
}

.ql-container.ql-snow {
  border: 0px;
  background-color: transparent;
}

.ql-clipboard {
  left: -100000px;
  height: 1px;
  overflow-y: hidden;
  position: absolute;
  top: 50%;
}

.editing .text-line {
  cursor: text;
}
</style>
