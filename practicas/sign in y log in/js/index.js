import { User } from "./classes/user.js"

window.addEventListener('DOMContentLoaded', onDOMContentLoaded)

let USER_DB =[]

function onDOMContentLoaded(event){

 let signInForm = document.getElementById('signInForm') // traigo el formulario de sign
 let logInForm = document.getElementById('logInForm')// traigo el formulario de login
  signInForm.addEventListener('submit', SignIn)// agrego el evento submit al formulario sign
  logInForm.addEventListener('submit', onLogIn)// agrego el evento submit al formulario login

}

/**
 * Handles the log-in form submission, prevents the default form behavior,
 * retrieves user input values, and checks if the user exists in the USER_DB array.
 * If the user is found, displays a success message and hides the forms.
 * If the user is not found, displays an error message.
 *
 * @param {Event} event - The event object associated with the form submission.
 */

function onLogIn(event) {
 event.preventDefault() // no envia el formulario
 let name = document.getElementById('userName').value // datos insertados en el campo nombre
 let email = document.getElementById('userEmail').value// datos insertados en el campo email
 let newUser = new User(name, email) // usamos la clase User para montar la BBDD
 let userExists = USER_DB.findIndex((user) => user.name === name && user.email === email)// busco el usuario 

    if (userExists >= 0) {
        document.getElementById('loginInMessageOk').classList.toggle('hidden')// Oculto los formularios
        setTimeout(() => {
          document.getElementById('signInForm').classList.toggle('hidden')
          document.getElementById('logInForm').classList.toggle('hidden')
        }, 500)
      } else {
        document.getElementById('loginInMessageKo').classList.toggle('hidden')
    }
    USER_DB.push(newUser)
    updateUserDB()

    document.getElementById('signInMessageOk').classList.toggle('hidden')
  setTimeout(() => {
    document.getElementById('signInMessageOk').classList.toggle('hidden')
  }, 1000)
    
}

function SignIn(event){
    event.preventDefault()
    let email = document.getElementById('email').value
    let name = document.getElementById('name').value
    let newUser = new User(name, email)
    USER_DB.push(newUser)
    updateUserDB()
  

}

function updateUserDB() {
    localStorage.setItem('USER_DB', JSON.stringify(USER_DB))
  }
