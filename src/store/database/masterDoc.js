import fb from '@/firebaseConfig';
import helpers from './helpers';

const masterDocModule = {
  //  Easy VUEX firestore configuration
  firestorePath: 'masterDocs',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'masterDoc',
  statePropName: 'masterDocData',
  namespaced: true, // automatically added
  state: {
    subscribedId: null
  },
  getters: {
    masterDoc: state => {
      if (!state.masterDocData || !state.subscribedId) {
        return undefined;
      }
      const newState = state.masterDocData[state.subscribedId];
      return newState;
    },
    userInputs: (state, getters) => {
      if (!getters.masterDoc || !getters.masterDoc.userInputs) {
        return [];
      }
      //return a sorted array of userInputs
      const { userInputs } = getters.masterDoc;
      return Object.values(userInputs).sort((a, b) => a.order - b.order);
    }
  },
  mutations: {
    setSubscribedId(state, id) {
      state.subscribedId = id;
    }
  },
  actions: {
    subscribeToMasterDoc({ dispatch, commit }, data) {
      const { id } = data;
      if (!id) {
        throw 'no id was provided for the masterDoc to which you want to subscribe';
      }

      dispatch('openDBChannel', { where: [['id', '==', id]] });
      commit('setSubscribedId', id);
    },
    unsubscribeToMasterDoc({ dispatch }) {
      dispatch('closeDBChannel', { clearModule: true });
    },
    checkMasterDocAccessPersmissions(undefined, masterDocId) {
      //  MasterDoc router guard to ensure user permissions to view
      return new Promise(async (resolve, reject) => {
        resolve();
        return;
      });
    },
    updateMasterDocText({ dispatch, state }, { text }) {
      //return error if proper fields weren't provided
      const masterDocId = state.subscribedId;
      if (text == undefined) {
        throw 'no text field was provided for the updating the masterDoc';
      }

      //update vuex and database with vuex-easy-firestore
      dispatch('patch', { id: masterDocId, text });
    },
    adduserInput({ dispatch, getters, state }, { text, order, type }) {
      //get necessary items throw an error if not provided
      if (text == undefined) {
        throw 'no text field was provided for the new userInput';
      }
      if (isNaN(order)) {
        throw 'no order was provided for the new userInput or the provided order is not a number';
      }
      if (isNaN(type)) {
        throw 'no type was provided for the new userInput or the provided type is not a number';
      }

      //get necessary Id's
      const id = getters['dbRef'].doc().id;
      const masterDocId = state.subscribedId;

      //create the update object for the addition of the userInput
      const userInputUpdate = {};
      userInputUpdate[id] = {
        id,
        order,
        type,
        text,
        authorAnswer: { answer: 3, confidence: 0 }
      };

      //update all the other userInputs that have a greater order than the one being added
      const { userInputs } = getters;
      userInputs.forEach(userInput => {
        if (userInput.order >= order) {
          userInputUpdate[userInput.id] = {
            order: userInput.order + 2 - 1
            // order: userInput.order + 1

          };
        }
      });

      console.log(userInputUpdate);
      //update vuex and database with vuex-easy-firestore
      dispatch('patch', { id: masterDocId, userInputs: userInputUpdate });
      return id;
    },
    removeuserInput({ state, dispatch, getters }, { id }) {
      //get necessary Id's return error if not provided
      const masterDocId = state.subscribedId;
      if (!id) {
        throw 'no id was provided for the userInput you want to remove';
      }

      //find it's order and update all the ones with order greater than it
      const { userInputs } = getters;
      const currentuserInput = userInputs.find(e => e.id === id);
      const { order } = currentuserInput;
      const orderUpdate = {};
      userInputs.forEach(userInput => {
        if (userInput.order > order) {
          orderUpdate[userInput.id] = {
            order: userInput.order - 1
          };
        }
      });

      //create the update object to delete the current one
      const userInputUpdate = `${masterDocId}.userInputs.${id}`;

      //update vuex and database with vuex-easy-firestore
      dispatch('delete', userInputUpdate);
      dispatch('patch', { id: masterDocId, userInputs: orderUpdate });
    },
    updateuserInputText({ dispatch, state }, { id, text }) {
      //get necessary Id's
      const masterDocId = state.subscribedId;
      if (!text) {
        throw 'no text field was provided for the updated userInput text';
      }
      if (!id) {
        throw 'no id was provided for the userInput you want to update';
      }

      //create the update object
      const userInputUpdate = {};
      userInputUpdate[id] = {
        text
      };

      //update vuex and database with vuex-easy-firestore
      dispatch('patch', { id: masterDocId, userInputs: userInputUpdate });
    },
    updateuserInputType({ dispatch, state }, { id, type }) {
      //get necessary Id's
      const masterDocId = state.subscribedId;
      if (isNaN(type)) {
        throw 'type was either not provided or is not a number';
      }
      if (!id) {
        throw 'no id was provided for the userInput you want to update';
      }

      //create the update object
      const userInputUpdate = {};
      userInputUpdate[id] = {
        type
      };

      //update vuex and database with vuex-easy-firestore
      dispatch('patch', { id: masterDocId, userInputs: userInputUpdate });
    },
    updateuserInputAuthorAnswer({ dispatch, state }, { id, answer, confidence }) {
      const masterDocId = state.subscribedId;
      if (answer == undefined && confidence == undefined) {
        throw 'input answer and confidence was either not provided or is undefined';
      }

      //create the update object
      const userInputUpdate = {};
      userInputUpdate[id] = {
        authorAnswer: {
          answer,
          confidence
        }
      };

      //update vuex and database with vuex-easy-firestore
      dispatch('patch', { id: masterDocId, userInputs: userInputUpdate });
    },
    moveuserInputsByOrder({ dispatch, getters, state }, { ordersToMove, moveLocation }) {
      const masterDocId = state.subscribedId;
      if (ordersToMove.constructor !== Array) {
        throw 'input ordersToMove was either not provided or is not an array please check your function inputs and try again';
      }
      if (isNaN(moveLocation)) {
        throw 'moveLocation was either not provided or is not a number please check your function inputs and try again';
      }

      //get the update from our helper function
      let userInputsUpdate;
      try {
        userInputsUpdate = helpers.moveHelper(ordersToMove, moveLocation, getters.userInputs);
      } catch (e) {
        throw e;
      }
      console.log('userInputsUpdate', userInputsUpdate);
      //send the update
      dispatch('patch', { id: masterDocId, userInputs: userInputsUpdate });
    }
  }
};

export default masterDocModule;
