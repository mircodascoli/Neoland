// @ts-check
/**  @import {User} from '../clases/User.js'*/

/**
 * @module redux/store
 */

/**
 * @typedef {Object.<(string), any>} State
 * @property {User[] | []} users
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */
export const INITIAL_STATE = {
    users: [],// PASO 1
    isLoading: false,// Podría usarse para controlar cuando estamos realizando un fetch
    error: false,// Podría usarse para controlar cuando sucede un error
  }
  
  /**
   * @typedef {Object} ActionTypeUser
   * @property {string} type
   * @property {User} [user]
   */
 
  const ACTION_TYPES = {
    // CRUD
    // USER
    CREATE_USER: 'CREATE_USER',
    // READ_LIST: 'READ_LIST',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    DELETE_ALL_USERS: 'DELETE_ALL_USERS',
  }
  
  /**
   * Reducer for the app state.
   *
   * @param {State} state - The current state
   * @param {ActionTypeUser} action - The action to reduce
   * @returns {State} The new state
   */
  const appReducer = (state = INITIAL_STATE, action) => {
    
    const actionWithUser = /** @type {ActionTypeUser} */(action)
    switch (action.type) { 
      case ACTION_TYPES.CREATE_USER:
      return {
        ...state,
        users: [
          ...state.users,
          actionWithUser.user// Equivalente a USER_DB.push(newUser)
        ]
      };
      case ACTION_TYPES.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((/** @type {User} */user) => user._id !== actionWithUser?.user?._id)
      };
      default:
        return {...state};
    }
}
  
  /**
   * @typedef {Object} PublicMethods
   * @property {function} create
   * @property {function} read
   * @property {function} update
   * @property {function} delete
   * @property {function} getById
   * @property {function} getAll
   * @property {function} deleteAll
   * @property {function} [getByEmail]
   */
  /**
   * @typedef {Object} Store
   * @property {PublicMethods} user
   * @property {function} getState
   */
  /**
   * Creates the store singleton.
   * @param {appReducer} reducer
   * @returns {Store}
   */
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer
  
    // Private methods
    /**
     *
     * @param {ActionTypeUser} action
     * @param {function | undefined} [onEventDispatched]
     */
    const _dispatch = (action, onEventDispatched) => {
      let previousValue = currentState;
      let currentValue = currentReducer(currentState, action);
      currentState = currentValue;
  
      window.dispatchEvent(new CustomEvent('stateChanged', {
          detail: {
            type: action.type,
            changes: _getDifferences(previousValue, currentValue)
          },
          cancelable: true,
          composed: true,
          bubbles: true
      }));
      if (onEventDispatched) {
        // console.log('onEventDispatched', onEventDispatched);
        onEventDispatched();
        // onEventDispatched.call(this, {
        //   type: action.type,
        //   changes: _getDifferences(previousValue, currentValue)
        // })
      }
    }
    /**
     * Returns a new object with the differences between the `previousValue` and
     * `currentValue` objects. It's used to create a payload for the "stateChanged"
     * event, which is dispatched by the store every time it changes.
     *
     * @param {State} previousValue - The old state of the store.
     * @param {State} currentValue - The new state of the store.
     * @returns {Object} - A new object with the differences between the two
     *     arguments.
     * @private
     */
    const _getDifferences = (previousValue, currentValue) => {
      return Object.keys(currentValue).reduce((diff, key) => {
          if (previousValue[key] === currentValue[key]) return diff
          return {
              ...diff,
              [key]: currentValue[key]
          };
      }, {});
    }
  
    // Actions
 
    /**
     * Creates a new user inside the store
     * @param {User} user
     * @param {function | undefined} [onEventDispatched]
     * @returns void
     */
    const createUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_USER, user }, onEventDispatched);
  
    // Getters
     /**
   * Returns all the users
   * @returns {User[]}
   * 
   */
    const getAllUsers = () => { return currentState.users };
   /**
   * Returns the user with the specified id
   * @param {string} id
   * @returns {User | undefined}
   */
  const getUserById = (id) => { return currentState.users.find((/** @type {User} */user) => user._id === id) };
  /**
   * Returns the user with the specified email
   * @param {string} email
   * @returns {User | undefined}
   */
  const getUserByEmail = (email) => { return currentState.users.find((/** @type {User} */user) => user.email === email) };
   /**
   * Deletes an user
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
   const deleteUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_USER, user }, onEventDispatched);
   
   // Public methods
    /**
     *
     * @returns {State}
     */
    const getState = () => { return currentState };
  
    // Namespaced actions
    /** @type {PublicMethods} */
    const user = {
      create: createUser,
      read:function (){console.log('read')},
      update:function (){console.log('update')},
      delete: deleteUser,
      getById: getUserById,
      getByEmail: getUserByEmail,
      getAll: getAllUsers,
   
      deleteAll:function (){console.log('deleteAll')}

    }
    return {
      // Actions
      user,
      // Public methods
      getState
    }
  }
  
  // Export store
  export const store = createStore(appReducer)