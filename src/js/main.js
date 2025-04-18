// @ts-no-check
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
    let selector = document.getElementById('seleccionador')
    let openPopUpLink = document.querySelectorAll('[data-modal-target]')
    let closePopUpButton = document.querySelectorAll('[data-close-button]')

    formSign?.addEventListener('submit', SignIn)
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    formSignout?.addEventListener('submit', onSignOut)
    rangeCalculador?.addEventListener('change',onChangeRange)
    selector?.addEventListener('change', onChangeSelector)
    openPopUpLink.forEach((link) => {
      link.addEventListener('click', () => {
        let popUp = document.querySelector(`${link.dataset.modalTarget}`);
        openPopup(popUp);
      });
    });
    closePopUpButton.forEach((button) => {
      button.addEventListener('click', () => {
        let popUp =button.closest('.description');
        closePopup(popUp);
      });
    });
    readUsersFromLocalStorage()
    // checkLoggedIn()
    //debug
    console.log('contenido redux a cargar la pagina', store.getState())
    window.addEventListener('stateChanged', onStateChanged)
    onChangeSelector()
  
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

/**
 * Handles the input range change event, appending a <p> element to the
 * #inputs-calculador container with the current value of the range.
 *
 * @param {Event} event - The event object associated with the input range change.
 */
  function onChangeRange(event){
    let valorRange = Number(event.target.value)
    if (valorRange == undefined) {
      valorRange = 1000
    }
    console.log(valorRange)
    let labRange = document.getElementById('label-range')
    // while (labRange.innerHTML){ {
    //   labRange.innerHTML = ''
    // }
    labRange.innerText = `${valorRange} mls`
    onChangeSelector()
   
  } 
  
/**
 * Handles the selector change event, changing the text content of the
 * #ingrediente-1, #ingrediente-2, #ingrediente-3, and #ingrediente-4
 * elements based on the selected value of the selector. The values
 * are based on the drinks specified in the selector element's options.
 *
 * @param {Event} event - The event object associated with the
 *                        selector change.
 */
    function onChangeSelector(event) {
      let selector = document.getElementById('seleccionador')
      let tabla = document.getElementById('tabla-calculos')
      let ingrediente1 = document.getElementById('ingrediente-1')
      let ingrediente2 = document.getElementById('ingrediente-2')
      let ingrediente3 = document.getElementById('ingrediente-3')
      let ingrediente4 = document.getElementById('ingrediente-4')
      let selectedValue = selector.value
      let mlsingrediente1 =document.getElementById('mls-ingrediente-1')
      let mlsingrediente2 =document.getElementById('mls-ingrediente-2')
      let mlsingrediente3 =document.getElementById('mls-ingrediente-3')
      let mlsingrediente4 =document.getElementById('mls-ingrediente-4')
      let rangeCalculador = document.getElementById('range')
      let valorRange = rangeCalculador.value
      let labRange = document.getElementById('label-range')
      let rowIngrediente4 = document.getElementById('row-ingrediente-4')
   
      switch (selectedValue ) {
      
        case 'Negroni':
          labRange.innerText = `${valorRange} mls`
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          
          ingrediente1.innerText = 'Gin'
          ingrediente2.innerText = 'Campari'
          ingrediente3.innerText = 'Sweet Vermouth'
          ingrediente4.innerText = 'Water(recomended)'
          mlsingrediente1.innerText = `${Math.ceil(valorRange* 0.33)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange* 0.33)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange* 0.33)} mls`
          mlsingrediente4.innerText = `+${Math.ceil(valorRange* 0.15)} mls`

          break;
        case 'Manhattan':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Rye whiskey'
          ingrediente2.innerText = 'Sweet Vermouth'
          ingrediente3.innerText = 'Angostura bitters'
          ingrediente4.innerText = 'Water'
          mlsingrediente1.innerText = `${Math.ceil(valorRange * 0.66)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange * 0.33)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange * 0.01)} mls`
          mlsingrediente4.innerText = `+${Math.ceil(valorRange * 0.15)} mls`
          break;
        case 'Dry Martini':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Gin'
          ingrediente2.innerText = 'Dry Vermouth'
          ingrediente3.innerText = 'Water(recomended)'
          mlsingrediente1.innerText = `${Math.ceil(valorRange * 0.70)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange * 0.10)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange * 0.15)} mls`
          break;
        case 'Old Fashioned':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Bourbon whiskey'
          ingrediente2.innerText = 'Sugar syrup'
          ingrediente3.innerText = 'Angostura bitters'
          ingrediente4.innerText = 'Water'
          mlsingrediente1.innerText = `${Math.ceil(valorRange * 0.80)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange * 0.05)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange * 0.01)} mls`
          mlsingrediente4.innerText = `+${Math.ceil(valorRange * 0.15)} mls`
          break;
        case 'Paloma':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Tequila'
          ingrediente2.innerText = 'Lime juice'
          ingrediente3.innerText = 'Agave syrup'
          ingrediente4.innerText = 'Grapefruit soda'
          mlsingrediente1.innerText = `${Math.ceil(valorRange * 0.60)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange * 0.125)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange * 0.07)} mls`
          mlsingrediente4.innerText = `+${Math.ceil(valorRange * 0.10)} mls`
          break;
        case 'Dark & Stormy':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Dark spiced rum'
          ingrediente2.innerText = 'Lime juice'
          ingrediente3.innerText = 'Ginger beer'
          break;
        case 'Tom Collins':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Vodka'
          ingrediente2.innerText = 'Lemon juice'
          ingrediente3.innerText = 'Raspberry syrup'
          ingrediente4.innerText = 'Ginger Ale'
          break;
        case 'Berry Hiball':
          tabla.classList.remove('grey')
          rangeCalculador.disabled = false;
          ingrediente1.innerText = 'Vodka'
          ingrediente2.innerText = 'Lemon juice'
          ingrediente3.innerText = 'Raspberry syrup'
          ingrediente4.innerText = 'Ginger Ale'
          break;
      
        default:
          tabla.classList.add('grey')
          rangeCalculador.disabled = true;
          ingrediente1.innerText = ''
          ingrediente2.innerText = ' '
          ingrediente3.innerText = ' '
          ingrediente4.innerText = ' '
          mlsingrediente1.innerText = `0 mls`
          mlsingrediente2.innerText = `0 mls`
          mlsingrediente3.innerText = `0 mls`
          mlsingrediente4.innerText = `0 mls`
          ;
          break;
      }
  }

  function openPopup(popUp) {
    console.log(`the popup ${popUp} should open`)
    let overlay = document.getElementById('overlay')
    if (popUp == null) return
    popUp.classList.add('active')
    overlay.classList.add('active')
  }
  
  function closePopup(popUp) {
    console.log(`the popup ${popUp} should close`)
    const overlay = document.getElementById('overlay')
    if (popUp == null) return
    popUp.classList.remove('active')
    overlay.classList.remove('active')
  }