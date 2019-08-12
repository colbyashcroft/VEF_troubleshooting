const mutations = {
  setCurrentUser(state, val) {
    state.currentUser = val;
  },
  setUserProfile(state, val) {
    state.userProfile = val;
  },
  setCollaborators(state, val) {
    state.collaborators = val;
  },
  isUsernameValid(state, value) {
    state.isUsernameValid = value;
  }
};

export default mutations;
