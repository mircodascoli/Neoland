// @ts-no-check
import {User} from './clases/user.js'
import { RecetaGuardada } from './clases/payloadrecetas.js'
//import { Botellas } from './clases/Botellas.js'
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'
import { store, INITIAL_STATE } from './store/redux.js'

export const API_PORT = location.port ? `:${1337}` : ''
const TIMEOUT = 10000

window.addEventListener('DOMContentLoaded', DomContentLoaded)

/**
 * Evento que se lanza cuando el contenido de la página ha sido cargado en memoria
 * y se puede acceder a él.
 * @listens DOMContentLoaded
 */
function DomContentLoaded() {
  
    let formLog = document.getElementById('formLog')
    let formLogOut = document.getElementById('logOutForm')
    let formSignout = document.getElementById('signOutForm')
    let openPopUpLink = document.querySelectorAll('[data-modal-target]')
    let closePopUpButton = document.querySelectorAll('[data-close-button]')
    let bodyProductos = document.getElementById('bodyProductos')
    let formBusqueda =  document.getElementById('form-busqueda')
    let botonBuscar = document.getElementById('botonBuscar')
    let botonSave = document.getElementById('save')
   
    
    // let overlay = document.getElementById('overlay') 44 TO 48

   
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    formSignout?.addEventListener('submit', onSignOut)
    botonBuscar?.addEventListener('click', buscarProducto)
    botonSave?.addEventListener('click', saveRecipe)
    formBusqueda?.addEventListener('submit', buscarProducto)
    openPopUpLink.forEach((link) => {
      link.addEventListener('click', () => {
        let popUp = document.querySelector(`${link.dataset.modalTarget}`);
        openPopup(popUp, link);
      });
    });
  
    closePopUpButton.forEach((button) => {
      button.addEventListener('click', () => {
        let popUp =button.closest('.description');
        closePopup(popUp);
      });
    });
    
    if (bodyProductos != null){
      console.log('body encontrado, display productos') 
      displayProductos()
    }

    // overlay.addEventListener('click', () => {
    //   let popUp = document.querySelectorAll('.active');
//     //   closePopup(popUp);
//     // }) TERMINAR: CLICK EN EL OVERLAY PARA CERRAR EL POPUP
  }


// /**
//  * Handles the login form submission, prevents the default form behavior,
//  * retrieves user input values, and checks if a user exists in the USER_DB array.
//  * If the user is found, displays a success message, hides the forms, and shows
//  * the user link and log out form. If the user is not found, displays an error
//  * message.
//  *
//  * @param {Event} event - The event object associated with the form submission.
//  */
// async function LogIn(event) {
// event.preventDefault()
// //quiero buscar en la base de datos el id y si coincide, log in
    
//     let emailLogElement = document.getElementById('emailLog')
//     let emailLog =  /** @type {HTMLInputElement} */(emailLogElement)?.value
//     let passLogElement = document.getElementById('passwordLog')
//     let passLog =  /** @type {HTMLInputElement} */(passLogElement)?.value
//     let newUser = new User(emailLog, passLog, 'user')
//     const payload = JSON.stringify(newUser)
//     //Buscar en la BBDD si existe el usuario
//     // Usamos una petición HTTP para comprobar si el usuario existe
//    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/login`, 'POST', payload)
//     console.log("esta el la respuesta de el login apidata",apiData)
//     if (Object.keys(apiData).length >= 0) {
//         // Guardamos los datos del usuario en la sesión
//         let userPartyTime= JSON.stringify(apiData)
//         console.log(userPartyTime)
//         sessionStorage.setItem('user', userPartyTime)//userPartyTime)
//         document.body.classList.add('loading')
//         // Actualizo el interfaz
//         setTimeout(() => {
//            location.href = './user.html'}, 1000)
//         } else {
   
//           document.getElementById('Rejected')?.classList.remove('hidden')
//           document.getElementById('Logged')?.classList.add('hidden')
//           if (/** @type {any} */(apiData)?.error === true) {
//             console.error(/** @type {any} */(apiData)?.message)
//             window.alert(/** @type {any} */(apiData)?.message)
//             return
//           }
//         }

//       }
// /**
//  * Updates the local storage with the latest state of the USER_DB array.
//  *
//  * @returns {void}
//  */
// function updateUserDB() {
//   // localStorage.setItem('USER_DB', JSON.stringify(USER_DB.get()))
//   // Leemos el nodo users almacenado en localstorage REDUX_DB,
//   let localStoredString = localStorage.getItem('REDUX_DB')
//   let localStoredData = JSON.parse(localStoredString || '')
//   // y guardamos lo que tengamos en store.user.getAll()
//   localStoredData.users = [...store.user.getAll()]
//   localStorage.setItem('REDUX_DB', JSON.stringify(localStoredData))
// }


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
      // updateUserDB()
      // Eliminar la sesión del usuario
      sessionStorage.removeItem('user')
      alert('Usuario borrado correctamente')
      location.href = './index.html'
    }

  }
    

//  async function saveRecipe(){
//   let selector = document.getElementById('seleccionador')
//   let selectedValue = selector?.value
//   let ingrediente1 = document.getElementById('ingrediente-1')
//   let ingrediente2 = document.getElementById('ingrediente-2')
//   let ingrediente3 = document.getElementById('ingrediente-3')
//   let ingrediente4 = document.getElementById('ingrediente-4')
//   let mlsingrediente1 =document.getElementById('mls-ingrediente-1')
//   let mlsingrediente2 =document.getElementById('mls-ingrediente-2')
//   let mlsingrediente3 =document.getElementById('mls-ingrediente-3')
//   let mlsingrediente4 =document.getElementById('mls-ingrediente-4')
//   let rangeCalculador = document.getElementById('range')
//   let valorRange = rangeCalculador?.value
//   let newReceta= new RecetaGuardada(selectedValue,
//     ingrediente1.innerText,
//     mlsingrediente1.innerText,
//     ingrediente2.innerText,
//     mlsingrediente2.innerText,
//     ingrediente3.innerText,
//     mlsingrediente3.innerText,
//     ingrediente4.innerText,
//     mlsingrediente4.innerText,
//     valorRange);
    
//   let PAYLOAD = JSON.stringify(newReceta)
//   console.log("esta es PAYLOAD ", PAYLOAD )
//   const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/users`, 'PUT', PAYLOAD)
//    console.log("esta es apidata",apiData)

// }
 
  function closePopup(popUp) {
     console.log(`the popup ${popUp} should close`)
     let overlay = document.getElementById('overlay')
    if (popUp == null) return
    console.log(popUp.classList)
    popUp.classList.remove('active')
    overlay.classList.remove('active')
  }

/**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */
function getDataFromSessionStorage() {
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(sessionStorage.getItem('PARTYTIME_SESSION') || defaultValue)
}

  /**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {any} [data]
 * @returns {Promise<Array<User | Botellas>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData

  try {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', '*')
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length))
    }
    // Añadimos la cabecera Authorization si el usuario esta logueado
    if (isUserLoggedIn()) {
      const userData = getDataFromSessionStorage()
      headers.append('Authorization', `Bearer ${userData?.user?.token}`)
    }
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(TIMEOUT),
      method: method,
      body: data ?? undefined,
      headers: headers
    });
  } catch (/** @type {any | HttpError} */err) {
    // En caso de error, controlamos según el tipo de error
    if (err.name === 'AbortError') {
      console.error('Fetch abortado');
    }
    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }
      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }
  }

  return apiData
}
/**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
  const userData = getDataFromSessionStorage()
  return userData?.user?._id
}

async function displayProductos() {
  try {
    const listaProductos = document.getElementById('listaProductos');
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/botellas`, 'GET')
   
    console.log(apiData)
    apiData.forEach((botella) => {
      const producto = document.createElement('li');
      producto.innerHTML = `
        <h3>${botella.name}</h3>
         <p>${botella.spirit}</p>
        <p>${botella.price}</p>
       `;
      listaProductos.appendChild(producto);
    });
  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  }
}

async function buscarProducto(event){
  event.preventDefault()
  let InputBusqueda = document.getElementById('busqueda') 
  let valorBusqueda = InputBusqueda.value
  let newBotella = {name: valorBusqueda}
    const payload = JSON.stringify(newBotella)
    //Buscar en la BBDD si existe el usuario
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/busqueda`, 'POST', payload)
    console.log(apiData)

}
/**
 * Retrieves the value from the specified input element.
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */
export function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}