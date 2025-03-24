
import pokedex from '/pokedex/pokedex.json' with { type: "json" }

/*
# Tarea: buscar un pokemon

1. Escribo en el formulario el nombre o el número del pokemon
2. Pincho en el botón de buscar
3. Usando Javascript, busco en la base de datos un pokemon que coincida con la búsqueda
4. Devuelvo los datos de ese pokemon a la página web
5. Limpio la tabla de pokemons para dejarla preparada
6. Añado un LI a la lista ordenada de pokemons con los datos del pokemon y la estructura HTML
*/

window.addEventListener("DOMContentLoaded", onDOMContentLoaded)

/**
 * Evento que se lanza cuando el contenido de la página ha sido cargado en memoria
 * y se puede acceder a él.
 * @listens DOMContentLoaded
 */
function onDOMContentLoaded() {
  let botonBuscar = document.getElementById('botonBuscar')
  let formulario = document.getElementById('formulario')
  let campoBusqueda= document.getElementById('busqueda') // aqui empezamos agarrando nuestra herramienta del dom
  botonBuscar.addEventListener('click', buscarPokemon)
  formulario.addEventListener('submit', buscarPokemon)
  campoBusqueda.addEventListener('keyup', onInputKeyUp) // aqui hemos creados eventos. los eventos funionan con(accion,funcion)

  leerListaPokemons() // llama la funcion abajo donde creo la lista.
}

/**
 * Lee la lista de pokemons de la base de datos y pinta el HTML
 *
 * @listens DOMContentLoaded
 * @param {Number} [maxPokemons=10] Número máximo de pokemons a mostrar
 */
function leerListaPokemons(maxPokemons = 10) {
  let listaPokemons = document.getElementsByClassName('lista-pokemons')

 while (listaPokemons.firstChild) {
  listaPokemons.removeChild(listaPokemons.firstChild)// este es un while que nececitamos para limpiar la lista
  }
 
  for (let i = 0; i < maxPokemons; i++) { //il for 
    addPokemonToList(pokedex[i])

  }
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles the search of a Pokémon based on user input from the search form.
 * Prevents the form from submitting, retrieves the search input, and 
 * searches the Pokédex data for matching Pokémon either by ID or name. 
 * If no input is provided, restores the default list of Pokémons. If a 
 * match is found, it clears the existing Pokémon list and displays the 
 * search results. If no matches are found, it alerts the user.
 * 
 * @param {Event} event - The event triggered by the search form submission.
 */

/******  03fd1677-cc04-420c-8c25-b3724667f1c2  *******/
function buscarPokemon(event) {
  //paramos el envio del formulario
  event.preventDefault()

  let listaPokemons = document.getElementsByClassName('lista-pokemons')[0] // puede funcionar sin index? y porque es mejor ponerlo
  let campoBusqueda = document.getElementById('busqueda')
  let resultadosBusqueda = [] // creo un array vacio
  if (campoBusqueda.value  === '') {
    leerListaPokemons(12)
    return
  } //
  if(Number.isInteger(Number(campoBusqueda.value))){
    console.log('buscamos por id de pokemon')
    resultadosBusqueda = pokedex.filter((pokemon) => pokemon.id === Number(campoBusqueda.value))
  } else {
    console.log('buscamos por nombre de pokemon')
    resultadosBusqueda = pokedex.filter(pokemon => pokemon.name.english.toLowerCase().includes(campoBusqueda.value.toLowerCase()))  
  }
  if (resultadosBusqueda.length === 0) {
    window.alert('Pokemon no encontrado')
    return
  }
  // Vacío la tabla antes de rellenar con los nuevos pokemons
  while (listaPokemons.firstChild) {
    listaPokemons.removeChild(listaPokemons.firstChild)
  }

  // Por cada pokemon encontrado
  for (let i = 0; i < resultadosBusqueda.length; i++) {
    addPokemonToList(resultadosBusqueda[i])
  }
}

function addPokemonToList(pokemon) {
  let listaPokemons = document.getElementsByClassName('lista-pokemons')[0]
  let liElement = document.createElement('li') // creo el li
  let FigureElement = document.createElement('figure')// creo el figure
  FigureElement.classList.add('fichaPokemon')
  liElement.classList.add('pokemon')

  let nombrePokemon = document.createElement('p') // creo el p
  nombrePokemon.innerText = pokemon.name.english // busco el nombre en ingles en la base de datos
  nombrePokemon.classList.add('nombre')// le doy una clase
  
  let imagenPokemon = document.createElement('img') // assigno alla variabile un file immagine
  imagenPokemon.setAttribute('src', `/pokedex/images/${String(pokemon.id).padStart(3, '0')}.png`)
  imagenPokemon.setAttribute('alt', pokemon.name.english)
  imagenPokemon.setAttribute('title', pokemon.name.english)

  let numeroPokemon = document.createElement('figcaption')// creo el figcaption
  let idPokemon= String (pokemon.id) // creo variable string con loop en la base de datos"id"
  numeroPokemon.innerText = ` N.º ${ idPokemon.padStart(4, '0') }` // creo il template string con padStart y los 0 que nececito
  numeroPokemon.classList.add('numero') //aggiungo una classe al figcaption
  
  let parrafoTipo  = document.createElement('p') // creo el p donde insertar los span de tipo pokemon
  parrafoTipo.classList.add('parrafo-Tipo') //añado una clase al p

  for(let tipo of pokemon.type){ //el loop va a recorrer la base de datos y va a crear un span por cada tipo
     let spanTipo = document.createElement('span')// creo el span
     spanTipo.classList.add('tag', tipo.toLowerCase())// 
     spanTipo.innerText = tipo//!!!!! Aqui hay que añadir por cada span solo 1 tipo
     parrafoTipo.appendChild(spanTipo)// agrego el span al p

   }
 
  listaPokemons.appendChild(liElement)//añadir pokemon a la lista
  liElement.appendChild(FigureElement)// añadir figure a li
  FigureElement.appendChild(imagenPokemon)// Añadir imagen a figure
  FigureElement.appendChild(numeroPokemon)// Añadir numero(figcaption) a figure
  FigureElement.appendChild(nombrePokemon)// Añadir nombre(p) a figure
  liElement.appendChild(parrafoTipo)// agrego el p al li
}

function onInputKeyUp(event) {// Keyup: mirar teclas pulsadas
  // console.log(event.key)
  let campoBusqueda = document.getElementById('busqueda')
  if(campoBusqueda.value  === ''){
    leerListaPokemons(12)
  }
  
}

/**
 * Busco un pokemon determinado usando el formulario de búsqueda
 */

