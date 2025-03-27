
window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

function onDOMContentLoaded() {
    let form = document.getElementById('signInForm');
    let email = document.getElementById('email');
    let name = document.getElementById('name');
   

    addEventListener('submit',datosRecibidos)


    // defino todas las variables
    // defino un evento que hara un submit en el local storage

}

function datosRecibidos(event){
    event.preventDefault()

}
