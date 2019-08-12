const masterDocUIModule = {
  namespaced: true,
  modules: {},
  state: () => ({
    dragging: false,
    animating: false,
    hoveringItem: {
      id: null,
      type: null
    },
    editinguserInputId: null,
    selectedPageId: 'masterDocTitle',
    focusTo: null,
    highlightedItems: []
  }),
  getters: {},
  mutations: {
    setDragging(state, val) {
      state.dragging = val;
    },
    setAnimating(state, val) {
      state.animating = val;
    },
    setHoveringItem(state, val) {
      state.hoveringItem = val;
    },
    setEditinguserInputId(state, val) {
      state.editinguserInputId = val;
    },
    setSelectedPageId(state, val) {
      state.selectedPageId = val;
    },
    setFocusTo(state, val) {
      state.focusTo = val;
    },
    removeItemFromHighlightedItems(state, id) {
      const i = state.highlightedItems.indexOf(id);
      if (i !== -1) {
        state.highlightedItems.splice(i, 1);
      }
    },
    addItemToHighlightedItems(state, id) {
      state.highlightedItems.push(id);
    },
    setHighlightedItems(state, v = []) {
      state.highlightedItems = v;
    }
  }
};

export default masterDocUIModule;
