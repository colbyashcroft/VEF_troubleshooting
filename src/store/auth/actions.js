import fb from '../../firebaseConfig';
import router from '../../router';
import Vue from 'vue';

let userProfileSub;

const actions = {
  subscribeToUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      const userRef = fb.usersCollection.doc(state.currentUser.uid);
      userRef.get().then(docSnapshot => {
        if (docSnapshot.exists) {
          userProfileSub = userRef.onSnapshot(doc => {
            commit('setUserProfile', doc.data());
            //  mutlianalytics identify
            Vue.prototype.$ma.setUserProperties({
              UserId: state.currentUser.uid,
              Name: doc.data().profile.name,
              $email: doc.data().emails[0].address,
              BetaUser: true
            });
          });
          resolve();
        } else {
          reject();
        }
      });
    });
  },
  // async fetchCollaborators({ commit, state }) {
  //   try {
  //     const collaborators = state.userProfile.collaborators;
  //     if (collaborators.length) {
  //       const cData = [];
  //       await Promise.all(
  //         collaborators.map(async id => {
  //           const result = await fb.usersCollection.doc(id).get();
  //           if (result.exists) {
  //             const d = result.data();
  //             d.id = result.id;
  //             cData.push(d);
  //           }
  //         })
  //       );
  //       //Do something after all that is done
  //       commit('setCollaborators', cData);
  //     }
  //   } catch (e) {
  //     console.log('no contributors');
  //   }
  // },
  firebaseUiRegister({ commit, dispatch }, uiComponent) {
    console.log(fb);
    const uiConfig = {
      signInOptions: [
        {
          provider: fb.providerIds.GoogleAuthProvider.PROVIDER_ID,
          authMethod: 'https://accounts.google.com',
          clientId: '1028085654256-d1jlro47g257e967sr6dmj6mftvgavc6.apps.googleusercontent.com'
        },
        {
          provider: fb.providerIds.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true
        }
      ],
      //credentialHelper: fb.firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult(user) {
          console.log(user);

          commit('setCurrentUser', user.user);

          //  Check if user exists in db
          dispatch('subscribeToUser')
            .then(() => {
              // exists, identify user to analytics
              Vue.prototype.$ma.identify({ userId: user.user.uid });
            })
            .catch(() => {
              //  user does not exist yet, create it
              //  Set mulianalytics identity
              Vue.prototype.$ma.setAlias(user.user.uid);
              Vue.prototype.$ma.identify({ userId: user.user.uid });

              //  Create user document
              fb.usersCollection
                .doc(user.user.uid)
                .set({
                  emails: [
                    {
                      address: user.user.email,
                      verified: user.user.emailVerified
                    }
                  ],
                  profile: {
                    name: user.user.displayName,
                    avatar: user.user.photoURL
                  },
                  collaborators: [],
                  createdAt: new Date(),
                  active: true,
                  user: true,
                  handles: {
                    twitter: false,
                    slack: false
                  }
                })
                .then(() => {
                  dispatch('subscribeToUser');
                })
                .catch(err => {
                  console.log(err);
                });
            });
        }
      }
    };
    const ui = new fb.firebaseui.auth.AuthUI(fb.auth);
    ui.start(uiComponent, uiConfig);
  },
  sendEmailVerification() {
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080/'
        : 'https://masterDoc-195220.firebaseapp.com/welcome';

    const actionCodeSettings = {
      url,
      // iOS: {
      //   bundleId: 'com.example.ios'
      // },
      // android: {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12'
      // },
      handleCodeInApp: true
    };
    fb.auth.currentUser
      .sendEmailVerification(actionCodeSettings)
      .then(() => {
        // Verification email sent.
        console.log('email sent');
      })
      .catch(error => {
        console.log(error);
        // Error occurred. Inspect error.code.
      });
  },
  resetPassword(email) {
    return new Promise((resolve, reject) => {
      fb.auth
        .sendPasswordResetEmail(email)
        .then(() => {
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err.reason);
        });
    });
  },
  clearData({ commit }) {
    commit('setCurrentUser', null);
    commit('setUserProfile', {});
  },
  updateProfile({ state }, data) {
    return new Promise((resolve, reject) => {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .update(data)
        .then(() => {
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err.reason);
        });
    });
  },
  logout({ dispatch }) {
    fb.auth
      .signOut()
      .then(() => {
        Vue.prototype.$ma.trackEvent({ action: 'User Logged Out' });
        Vue.prototype.$ma.reset();
        dispatch('clearData');
        userProfileSub();
        router.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export default actions;
