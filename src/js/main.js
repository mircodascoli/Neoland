// @ts-no-check
import {User} from './clases/user.js'
import { RecetaGuardada } from './clases/payloadrecetas.js'
//import { Botellas } from './clases/Botellas.js'
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'
import { store, INITIAL_STATE } from './store/redux.js'

const API_PORT = location.port ? `:${1337}` : ''
const TIMEOUT = 10000

window.addEventListener('DOMContentLoaded', DomContentLoaded)

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
    let bodyProductos = document.getElementById('bodyProductos')
    let formBusqueda =  document.getElementById('form-busqueda')
    let botonBuscar = document.getElementById('botonBuscar')
    let botonSave = document.getElementById('save')
   
    
    // let overlay = document.getElementById('overlay') 44 TO 48

    formSign?.addEventListener('submit', SignIn)
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    formSignout?.addEventListener('submit', onSignOut)
    rangeCalculador?.addEventListener('change',onChangeRange)
    selector?.addEventListener('change', onChangeSelector)
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
    //   closePopup(popUp);
    // }) TERMINAR: CLICK EN EL OVERLAY PARA CERRAR EL POPUP
 }


/**
 * Handles the sign-in form submission, prevents the default form behavior,
 * retrieves user input values, creates a new User instance, and adds it to
 * the USER_DB array. Finally, logs the updated USER_DB to the console.
 * 
 */
async function SignIn(event) {

  event.preventDefault()

    let emailSignElement = document.getElementById('emailSign')
    let emailSign = /** @type {HTMLInputElement} */(emailSignElement)?.value
    let PassSignElement = document.getElementById('passwordSign')
    let PassSign = /** @type {HTMLInputElement} */(PassSignElement)?.value
    let NewUser = new User(emailSign,PassSign , 'user')
    const payload = JSON.stringify(NewUser)
  
    console.log('busco en la BBDD el email ' + emailSign, store.user.getByEmail?.(emailSign))
    if(store.user.getByEmail?.(emailSign)!==undefined){
      document.getElementById('AlreadyRegistered')?.classList.remove('hidden')
      return
    }
    else {
    document.getElementById('AlreadyRegistered')?.classList.add('hidden')
    
    // Sustituir por llamada fetch al servidor de apis
  // Enviar el fetch a la API, crear nuevo usuario
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', payload)
 console.log(apiData)
      if (!apiData) {
        // Informo al usuario del resultado de la operación
        document.getElementById('AlreadyRegistered')?.classList.remove('hidden')
        setTimeout(() => {
          document.getElementById('AlreadyRegistered')?.classList.add('hidden')
        }, 1000)
        console.error('Error al crear usuario', apiData)
        return
      }
      console.log('Respuesta del servidor de APIs', apiData)
      // store.user.create(newUser, () => {
        updateUserDB()
        // Informo al usuario del resultado de la operación
        document.getElementById('registered')?.classList.remove('hidden')
        setTimeout(() => {
          document.getElementById('registered')?.classList.add('hidden')
        }, 1000)

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
async function LogIn(event) {
event.preventDefault()
//quiero buscar en la base de datos el id y si coincide, log in
    
    let emailLogElement = document.getElementById('emailLog')
    let emailLog =  /** @type {HTMLInputElement} */(emailLogElement)?.value
    let passLogElement = document.getElementById('passwordLog')
    let passLog =  /** @type {HTMLInputElement} */(passLogElement)?.value
    let newUser = new User(emailLog, passLog, 'user')
    const payload = JSON.stringify(newUser)
    //Buscar en la BBDD si existe el usuario
    // Usamos una petición HTTP para comprobar si el usuario existe
   const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/login`, 'POST', payload)
    console.log("esta el la respuesta de el login apidata",apiData)
    if (Object.keys(apiData).length >= 0) {
        // Guardamos los datos del usuario en la sesión
        let userPartyTime= JSON.stringify(apiData)
        console.log(userPartyTime)
        sessionStorage.setItem('user', userPartyTime)//userPartyTime)
        document.body.classList.add('loading')
        // Actualizo el interfaz
        setTimeout(() => {
           location.href = './user.html'}, 1000)
        } else {
   
          document.getElementById('Rejected')?.classList.remove('hidden')
          document.getElementById('Logged')?.classList.add('hidden')
          if (/** @type {any} */(apiData)?.error === true) {
            console.error(/** @type {any} */(apiData)?.message)
            window.alert(/** @type {any} */(apiData)?.message)
            return
          }
        }

      }
/**
 * Updates the local storage with the latest state of the USER_DB array.
 *
 * @returns {void}
 */
function updateUserDB() {
  // localStorage.setItem('USER_DB', JSON.stringify(USER_DB.get()))
  // Leemos el nodo users almacenado en localstorage REDUX_DB,
  let localStoredString = localStorage.getItem('REDUX_DB')
  let localStoredData = JSON.parse(localStoredString || '')
  // y guardamos lo que tengamos en store.user.getAll()
  localStoredData.users = [...store.user.getAll()]
  localStorage.setItem('REDUX_DB', JSON.stringify(localStoredData))
}


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
 */
    function onChangeSelector() {
      let selector = document.getElementById('seleccionador')
      let tabla = document.getElementById('tabla-calculos')
      let ingrediente1 = document.getElementById('ingrediente-1')
      let ingrediente2 = document.getElementById('ingrediente-2')
      let ingrediente3 = document.getElementById('ingrediente-3')
      let ingrediente4 = document.getElementById('ingrediente-4')
      let selectedValue = selector?.value
      let mlsingrediente1 =document.getElementById('mls-ingrediente-1')
      let mlsingrediente2 =document.getElementById('mls-ingrediente-2')
      let mlsingrediente3 =document.getElementById('mls-ingrediente-3')
      let mlsingrediente4 =document.getElementById('mls-ingrediente-4')
      let rangeCalculador = document.getElementById('range')
      let valorRange = rangeCalculador?.value
      let labRange = document.getElementById('label-range')
      
      if (rangeCalculador !== null && rangeCalculador !== undefined) {
        rangeCalculador.removeAttribute('disabled');
      }
     
      switch (selectedValue ) {
       
        case 'Negroni':
          labRange.innerText = `${valorRange} mls`
          tabla.classList.remove('grey')
          
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

          ingrediente1.innerText = 'Gin'
          ingrediente2.innerText = 'Dry Vermouth'
          ingrediente3.innerText = 'Water(recomended)'
          mlsingrediente1.innerText = `${Math.ceil(valorRange * 0.70)} mls`
          mlsingrediente2.innerText = `${Math.ceil(valorRange * 0.10)} mls`
          mlsingrediente3.innerText = `${Math.ceil(valorRange * 0.15)} mls`
          //ADD OLIVE BRINE AS 4 TH INGREDIENT
          break;
        case 'Old Fashioned':
          tabla.classList.remove('grey')

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

          ingrediente1.innerText = 'Dark spiced rum'
          ingrediente2.innerText = 'Lime juice'
          ingrediente3.innerText = 'Ginger beer'
          // ADD ANGOSTURA BITTERS AS 4TH INGREDIENT 
          break;
        case 'Tom Collins'://COMPLETE THE REST FROM HERE TO 361
          tabla.classList.remove('grey')

          ingrediente1.innerText = 'Vodka'
          ingrediente2.innerText = 'Lemon juice'
          ingrediente3.innerText = 'Raspberry syrup'
          ingrediente4.innerText = 'Ginger Ale'
          break;
        case 'Berry Hiball':
          tabla.classList.remove('grey')

          ingrediente1.innerText = 'Vodka'
          ingrediente2.innerText = 'Lemon juice'
          ingrediente3.innerText = 'Raspberry syrup'
          ingrediente4.innerText = 'Ginger Ale'
          break;
      
        default:
          tabla?.classList.add('grey')

          ingrediente1.innerText = ' '
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

  function openPopup(popUp, link) {
    let overlay = document.getElementById('overlay')
    let titlePop = document.getElementById('pop-up-name');
    let bodyText = document.getElementById('pop-up-text');
    let h3 = link.querySelector('h3');
    let craftButton = document.getElementById('craft-button');
    titlePop.innerText = h3.innerText;
    // apri il popup
    overlay.classList.add('active');
    popUp.classList.add('active');
    // cambiar ficha de la receta en el pop up a partir de el nombre
    switch (titlePop.innerText.toLowerCase()) {
      case 'negroni':
         bodyText.innerText = 'negroni negroni negroni negroni negroni negroni negroni negroni negroni negroni negroni negroni '
        break;
      case 'manhattan':
        bodyText.innerText = 'manhattan manhattan manhattan manhattan manhattan manhattan manhattan manhattan manhattan manhattan manhattan manhattan '
        break;
      case 'old fashioned':
        bodyText.innerText = 'old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned old fashioned '
        break;
      case 'dry martini':
        bodyText.innerText = 'dry martini dry martini dry martini dry martini dry martini dry martini dry martini dry martini dry martini dry martini dry martini '
        break;
      case 'tom collins':
        bodyText.innerText = 'tom collins tom collins tom collins tom collins tom collins tom collins tom collins tom collins tom collins tom collins tom collins '
        break;
      case 'paloma':
        bodyText.innerText = 'paloma paloma paloma paloma paloma paloma paloma paloma paloma paloma paloma paloma paloma '
        break;
      case 'dark & stormy':
        bodyText.innerText = 'dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy dark & stormy '
        break;
      case 'berry hiball':
        bodyText.innerText = 'berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball berry hiball '
        break;
      default:
        bodyText.innerText = '';
        break;
      }
        craftButton.addEventListener('click', () => {
          // reindirizza l'utente alla pagina calculadores.html
          console.log('redirect to calculadores.html');
          window.location.href = './calculadores.html';
        }); 
   

 }

 async function saveRecipe(){
  let selector = document.getElementById('seleccionador')
  let selectedValue = selector?.value
  let ingrediente1 = document.getElementById('ingrediente-1')
  let ingrediente2 = document.getElementById('ingrediente-2')
  let ingrediente3 = document.getElementById('ingrediente-3')
  let ingrediente4 = document.getElementById('ingrediente-4')
  let mlsingrediente1 =document.getElementById('mls-ingrediente-1')
  let mlsingrediente2 =document.getElementById('mls-ingrediente-2')
  let mlsingrediente3 =document.getElementById('mls-ingrediente-3')
  let mlsingrediente4 =document.getElementById('mls-ingrediente-4')
  let rangeCalculador = document.getElementById('range')
  let valorRange = rangeCalculador?.value
  let newReceta= new RecetaGuardada(selectedValue,
    ingrediente1.innerText,
    mlsingrediente1.innerText,
    ingrediente2.innerText,
    mlsingrediente2.innerText,
    ingrediente3.innerText,
    mlsingrediente3.innerText,
    ingrediente4.innerText,
    mlsingrediente4.innerText,
    valorRange);
    
  let PAYLOAD = JSON.stringify(newReceta)
  console.log("esta es PAYLOAD ", PAYLOAD )
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/users`, 'PUT', PAYLOAD)
   console.log("esta es apidata",apiData)

}
 
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
  return userData?.user?.token
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