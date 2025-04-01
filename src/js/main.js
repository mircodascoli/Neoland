import {User} from './clases/user.js'
import {SingletonDB} from './clases/SingletonDB.js'

window.addEventListener('DOMContentLoaded', DomContentLoaded)
const USER_DB = new SingletonDB()
/**
 * Evento que se lanza cuando el contenido de la página ha sido cargado en memoria
 * y se puede acceder a él.
 * @listens DOMContentLoaded
 */
function DomContentLoaded() {
    let formSign = document.getElementById('formSign')
    let formLog = document.getElementById('formLog')
    let formLogOut = document.getElementById('FormLogOut')
    let formSignout = document.getElementById('FormSignOut')

    formSign?.addEventListener('submit', SignIn)
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    formSignout?.addEventListener('submit', onSignOut)

    readUserDB()
    checkLoggedIn()
}

/**
 * Handles the sign-in form submission, prevents the default form behavior,
 * retrieves user input values, creates a new User instance, and adds it to
 * the USER_DB array. Finally, logs the updated USER_DB to the console.
 * @param {Event} event - The event object associated with the form submission.
 */
function SignIn(event) {
    event.preventDefault()

    let nameSign = document.getElementById('nameSign').value
    let emailSign = document.getElementById('emailSign').value
    let NewUser = new User(nameSign, emailSign)

    if (USER_DB.get().findIndex((user) =>  user.email === emailSign )>= 0) {
        document.getElementById('AlreadyRegistered').classList.remove('hidden')

        window.setTimeout(() => {
          document.getElementById('AlreadyRegistered').classList.add('hidden')
        },2000)
    return
    }else {

    document.getElementById('AlreadyRegistered').classList.add('hidden')
    
   USER_DB.push(NewUser)
   updateUserDB()

    document.getElementById('Registered').classList.remove('hidden')
    setTimeout(() => {
    document.getElementById('Registered').classList.add('hidden');

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

    let nameLog = document.getElementById('nameLog').value
    let emailLog = document.getElementById('emailLog').value

    let userExists = USER_DB.get().findIndex((user) => user.name === nameLog && user.email === emailLog)

    if (userExists >= 0) {
        // Guardamos los datos del usuario en la sesión
        sessionStorage.setItem('user', JSON.stringify(USER_DB.get()[userExists]))
        document.body.classList.add('loading')
        // Actualizo el interfaz
        setTimeout(() => {
            document.getElementById('userLink').classList.remove('hidden')
            document.getElementById('Logged').classList.remove('hidden')
            document.getElementById('Rejected').classList.add('hidden')
            document.getElementById('formSign').classList.add('hidden')
            document.getElementById('formLog').classList.add('hidden')
            document.getElementById('FormLogOut').classList.remove('hidden')
            document.getElementById('Logged').classList.add('hidden')
            document.body.classList.remove('loading')
          }, 1000)
        } else {
          document.getElementById('Rejected').classList.remove('hidden')
          document.getElementById('Logged').classList.add('hidden')
        }
}

/**
 * Updates the local storage with the latest state of the USER_DB array.
 *
 * @returns {void}
 */

function updateUserDB() {
    localStorage.setItem('USER_DB', JSON.stringify(USER_DB.get()))
  }

/**
 * Reads the USER_DB array from local storage and updates the global USER_DB
 * array with the retrieved data. If no data is found in local storage, the 
 * global USER_DB is left unchanged. Each user object is instantiated as a 
 * User instance.
 *
 * @returns {void}
 */

function readUserDB(){
  let savedUsers = []

  if (localStorage.getItem('USER_DB')) {
  savedUsers = JSON.parse(localStorage.getItem('USER_DB'))
        // Usamos la clase User también para montar la BBDD al cargar la página
      .map((user) => new User(user.name, user.email))
    }
    if (USER_DB.get() === undefined) {
      // console.log('inicializo el singleton de la base de datos')
    }else{
      USER_DB.push(...savedUsers)
    }
    
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
      USER_DB.get().splice(USER_DB.get().findIndex((user) => user.email === JSON.parse(sessionStorage.getItem('user')).email), 1)
      updateUserDB()
      // Eliminar la sesión del usuario
      sessionStorage.removeItem('user')
      alert('Usuario borrado correctamente')
      location.href = './index.html'
    }
  }
/**
 * Checks if a user is logged in by verifying session storage for user data.
 * If a user is logged in, it updates the UI to show the user link and log out form,
 * while hiding the sign-in and log-in forms. If no user is logged in and the current
 * page is not the home page, it redirects to the home page.
 */
    function checkLoggedIn() {
        if (sessionStorage.getItem('user')) {
          document.getElementById('userLink')?.classList.remove('hidden')
          document.getElementById('logOutForm')?.classList.remove('hidden')
          document.getElementById('signInForm')?.classList.add('hidden')
          document.getElementById('logInForm')?.classList.add('hidden')
        } else if (location.pathname !== '/index.html') {
          // Redirigimos a la home si el usuario no está identificado
          location.href = './index.html'
        }
      }
  //  