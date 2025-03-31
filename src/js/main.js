import {User} from './clases/user.js'
import {SingletonDB} from './clases/SingletonDB.js'

window.addEventListener('DOMContentLoaded', DomContentLoaded)
const USER_DB = new SingletonDB()
function DomContentLoaded() {
    let formSign = document.getElementById('formSign')
    let formLog = document.getElementById('formLog')
    let formLogOut = document.getElementById('FormLogOut')

    formSign?.addEventListener('submit', SignIn)
    formLog?.addEventListener('submit', LogIn)
    formLogOut?.addEventListener('submit', onLogOut)
    signOutForm?.addEventListener('submit', onSignOut)

    readUserDB()
    checkLoggedIn()
}

function SignIn(event) {
    event.preventDefault()

    let nameSign = document.getElementById('nameSign').value
    let emailSign = document.getElementById('emailSign').value
    let NewUser = new User(nameSign, emailSign)

    if (USER_DB.get().findIndex((user) =>  user.email === emailSign )>= 0) {
        document.getElementById('AlreadyRegistered').classList.remove('hidden')
    return
    }

    document.getElementById('AlreadyRegistered').classList.add('hidden')
    
   USER_DB.push(NewUser)
   updateUserDB()

    document.getElementById('Registered').classList.remove('hidden')
    setTimeout(() => {
    document.getElementById('Registered').classList.add('hidden')
    }, 2000)
   
}
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

function updateUserDB() {
    localStorage.setItem('USER_DB', JSON.stringify(USER_DB.get()))
  }

  function readUserDB(){
    let savedUsers = []

    if (localStorage.getItem('USER_DB')){
    savedUsers =JSON.parse(localStorage.getItem(USER_DB))
     }
    }
    
function onLogOut(event) {
    event.preventDefault()
    // Eliminar la sesión del usuario
    sessionStorage.removeItem('user')
    location.href = './index.html'
  }
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
  }