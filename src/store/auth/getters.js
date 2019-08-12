const getters = {
  fullname: state => {
    try {
      return state.userProfile.profile.name;
    } catch (e) {
      return false;
    }
  },
  isUser: state => !!state.currentUser,
  userId: state => (state.currentUser ? state.currentUser.uid : null),
  avatar: state => {
    try {
      return state.userProfile.profile.avatar;
    } catch (e) {
      return false;
    }
  },
  profile: state => (state.userProfile ? state.userProfile.profile : false),
  userEmail: state => (state.currentUser ? state.currentUser.email : null)
};

export default getters;
