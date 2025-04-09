// @ts-check
import {User} from './clases/User.js'
// import {SingletonDB} from './clases/SingletonDB.js'
// import { Botellas } from './clases/Botellas.js'
import { store, INITIAL_STATE } from './store/redux.js'

window.addEventListener('DOMContentLoaded', DomContentLoaded)
// const USER_DB = new SingletonDB()
/**
 * Evento que se lanza cuando el contenido de la página ha sido cargado en memoria
 * y se puede acceder a él.
 * @listens DOMContentLoaded
 */
function DomContentLoaded() {
    let formSign = document.getElementById('formSign')
    let formLog = document.getElementById('formLog')
    let formLogOut = document.getElementById('logOutForm')
    let formSignout = document.getElementById('signOutForm')
    let rangeCalculador = document.getElementById('range')

    formSign?.addEventListener('submit', SignIn)
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    formSignout?.addEventListener('submit', onSignOut)
    rangeCalculador?.addEventListener('change',onChangeRange)

    readUsersFromLocalStorage()
    // checkLoggedIn()
    //debug
    console.log('contenido redux a cargar la pagina', store.getState())
    window.addEventListener('stateChanged', onStateChanged)
}
/**
 * Handles a state change event from the store
 * @param {Event} event - The event object associated with the state change
 * @listens stateChanged
 */
function onStateChanged(event) {
  console.log('onStateChanged', /** @type {CustomEvent} */(event).detail)
}
/**
 * Handles the sign-in form submission, prevents the default form behavior,
 * retrieves user input values, creates a new User instance, and adds it to
 * the USER_DB array. Finally, logs the updated USER_DB to the console.
 * @param {Event} event - The event object associated with the form submission.
 * 
 */
function SignIn(event) {
    event.preventDefault()

    let nameSignElement =document.getElementById('nameSign')
    let nameSign = /** @type {HTMLInputElement} */(nameSignElement)?.value
    let emailSignElement = document.getElementById('emailSign')
    let emailSign = /** @type {HTMLInputElement} */(emailSignElement)?.value
    let NewUser = new User(nameSign, emailSign, 'user')
    /**
   * @callback filterUserCallback
   * @param {User} user
   * @returns number
   */
  /** @type {filterUserCallback} */
    console.log('busco en la BBDD el email ' + emailSign, store.user.getByEmail?.(emailSign))
    if(store.user.getByEmail?.(emailSign)!==undefined){
      document.getElementById('AlreadyRegistered')?.classList.remove('hidden')
      return
    }
    // if (USER_DB.get().findIndex((user) =>  user.email === emailSign )>= 0) {
    //     document.getElementById('AlreadyRegistered')?.classList.remove('hidden')

    //     window.setTimeout(() => {
    //       document.getElementById('AlreadyRegistered')?.classList.add('hidden')
    //     },2000)
    // return}
    else {
    document.getElementById('AlreadyRegistered')?.classList.add('hidden')
    
      store.user.create(NewUser)
      updateUserDB()

    document.getElementById('Registered')?.classList.remove('hidden')
    setTimeout(() => {
    document.getElementById('Registered')?.classList.add('hidden');
      console.log(store.getState())
    }, 2000)
  }
}
/**
 * Handles the login form submission, prevents the default form behavior,
 * retrieves user input values, and checks if a user exists in the USER_DB array.
 * If the user is found, displays a success message, hides the forms, and shows
 * the user link and log out form. If the user is not found, displays an error
 * message.
 *
 * @param {Event} event - The event object associated with the form submission.
 */
function LogIn(event) {
    event.preventDefault()

    let nameLogElement = document.getElementById('nameLog')
    let nameLog =  /** @type {HTMLInputElement} */(nameLogElement)?.value
    let emailLogElement = document.getElementById('emailLog')
    let emailLog =  /** @type {HTMLInputElement} */(emailLogElement)?.value
    

    let userExists = store.user.getAll().findIndex((/**@type {User}*/user) => user.name === nameLog && user.email === emailLog)

    if (userExists >= 0) {
        // Guardamos los datos del usuario en la sesión
        let userFromREDUX = store.user.getByEmail?.(emailLog)
        sessionStorage.setItem('user', JSON.stringify(userFromREDUX))
        document.body.classList.add('loading')
        // Actualizo el interfaz
        setTimeout(() => {
           location.href = './user.html'}, 1000)
        } else {
          document.getElementById('Rejected')?.classList.remove('hidden')
          document.getElementById('Logged')?.classList.add('hidden')
        }
}

/**
 * Updates the local storage with the latest state of the USER_DB array.
 *
 * @returns {void}
 */

function updateUserDB() {
let localStoredString = localStorage.getItem('REDUX_DB')
let localStoredData = JSON.parse(localStoredString || '')

localStoredData.users = [...store.user.getAll()]
  localStorage.setItem('REDUX_DB', JSON.stringify(localStoredData))
}
/**
 * Reads the USER_DB array from local storage and updates the global USER_DB
 * array with the retrieved data. If no data is found in local storage, the 
 * global USER_DB is left unchanged. Each user object is instantiated as a 
 * User instance.
 *
 * @returns {void}
 */

function readUsersFromLocalStorage(){
  let savedUsers = []

  if (localStorage.getItem('REDUX_DB')) {
    let localStoredREDUX_DB = localStorage.getItem('REDUX_DB')
    // Si no existe la clave 'user' en local store, localStoredUSER_DB es null
    if (localStoredREDUX_DB ===null){
      localStoredREDUX_DB  =' '
    }
  savedUsers = JSON.parse(localStoredREDUX_DB)
    ?.users
  .map((/**  @type {User} */user) => new User(user.name, user.email, user.rol, user.password, user.token, user._id))
    
      // console.log('inicializo el singleton de la base de datos')
    } else{
          // REDUX_DB no existe en local storage, tenemos que crear el valor por defecto
    console.log('Iniciamos local storage porque está vacío')
    localStorage.setItem('REDUX_DB', JSON.stringify(INITIAL_STATE))
    }
    // Replicamos lo mismo en REDUX
  savedUsers.forEach((/** @type {User} */newUser) => {
    store.user.create(newUser, () => {console.log('usuario creado')})
  })
    
    }
  
/**
 * Handles the log out form submission, prevents the default form behavior,
 * removes the user session data from session storage, and redirects to the home page.
 *
 * @param {Event} event - The event object associated with the form submission.
 */

function onLogOut(event) {
    event.preventDefault()
    // Eliminar la sesión del usuario
    sessionStorage.removeItem('user')
    location.href = './index.html'
  }
/**
 * Handles the sign-out form submission, prevents the default form behavior,
 * removes the user data from USER_DB, removes the user session data from
 * session storage, and redirects to the home page.
 *
 * @param {Event} event - The event object associated with the form submission.
 */
  function onSignOut(event) {
    event.preventDefault()
   
    // Borro el usuario, si está identificado
    if (sessionStorage.getItem('user') && confirm('¿Estás seguro de borrar tu usuario?')) {
      let localStoredUser = sessionStorage.getItem('user')
      if (localStoredUser === null) {
        localStoredUser= ''
       }
       console.log('usuario antes de borrar', JSON.parse(localStoredUser))
       store.user.delete(JSON.parse(localStoredUser))
       console.log('usuario borrado', store.user.getAll())  
      updateUserDB()
      // Eliminar la sesión del usuario
      sessionStorage.removeItem('user')
      alert('Usuario borrado correctamente')
      location.href = './index.html'
    }

  }
  export function getDataFromLocalStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(localStorage.getItem('REDUX_DB') || defaultValue)
  }

  function onChangeRange(event){
    console.log(event.target.value)
    let valorRange = event.target.value
    let inputCalculador = document.getElementById('inputs-calculador')
    let pElement = document.createElement('p')
    pElement.innerText = valorRange
    inputCalculador.appendChild(pElement)
// todo esto
  }
