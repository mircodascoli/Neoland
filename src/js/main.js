 //@ts-no-check


 
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './clases/HttpError.js'


export const API_PORT = location.port ? `:${1337}` : ''
const TIMEOUT = 10000

window.addEventListener('DOMContentLoaded', DomContentLoaded)

/**
 * Evento que se lanza cuando el contenido de la página ha sido cargado en memoria
 * y se puede acceder a él.
 * @listens DOMContentLoaded
 */
function DomContentLoaded() {
  
   
    let formLogOut = document.getElementById('logOutButton')
    let formSignout = document.getElementById('signOutButton')
    let openPopUpLink = document.querySelectorAll('[data-modal-target]')
    let closePopUpButton = document.querySelectorAll('[data-close-button]')
    let bodyCalculator = document.getElementById('body-calculadores')
    let bodyProductos = document.getElementById('bodyProductos')
    let bodyUser = document.getElementById('bodyUser')
    let formBusqueda =  document.getElementById('form-busqueda')
    let botonBuscar = document.getElementById('botonBuscar')
    let overlay = document.getElementById('overlay') 
    let craftButton = document.getElementById('craft-button');
    let signInFormLit = document.querySelector('signin-form-lit')
    let LogInFormLit = document.querySelector('log-in-form-lit')
    let bodyCarrito = document.getElementById('bodyCarrito') 
    let hamMenu= document.getElementById('hamMenu')
    formLogOut?.addEventListener('click', onLogOut)
    formSignout?.addEventListener('click', onSignOut)
    botonBuscar?.addEventListener('click', buscarProducto)
    craftButton?.addEventListener('click', redirectToCalculadores); 
    formBusqueda?.addEventListener('submit', buscarProducto)
    formBusqueda?.addEventListener('keyup', onInputKeyUp)
     hamMenu?.addEventListener('click',openSideBar)
   /*  deleteButton?.addEventListener('click', deleteItemFromCart) */
    openPopUpLink.forEach((link) => {
      link.addEventListener('click', () => {
        let popUp = document.querySelector(`${link.dataset.modalTarget}`);
        openPopup(popUp, link);
        console.log('pop up')
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
   
    if (bodyCalculator != null){
      console.log('body encontrado, display calculadores') 
      autoSelectOption()
    }
    if (bodyUser != null){
      console.log('body userencontrado, weloming user') 
      welcoming()
    }
    if (bodyCarrito != null){
      console.log('body carritoencontrado, display carrito') 
     loadCartData()

    }

    overlay?.addEventListener('click', () => {
      const activePopUps = document.querySelectorAll('.description.active');
      activePopUps.forEach((popUp) => closePopup(popUp));
    })
    signInFormLit?.addEventListener('signin-form-submit', (event) => {
    // Aquí decido qué hacer una vez lanzado el login
    console.log('signin-form-lit recogido desde el index.js', event?.detail)
    if (event?.detail?.text === 'User already exists') {
    console.log('ponemos el cartel de user existente')
    document.getElementById('already')?.classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('already')?.classList.add('hidden')
    }, 1500)
    }else{
      console.log('ponemos el cartel de user registrado')
    document.getElementById('registered')?.classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('registered')?.classList.add('hidden')
    }, 1500)
    }
    
  })

  LogInFormLit?.addEventListener('login-form-submit', (event) => {
  const { success, data, error } = event?.detail || {};

  if (success) {
    console.log('✅ Login riuscito:', data);
    document.getElementById('logged')?.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('logged')?.classList.add('hidden');
    }, 500);
  } else {
    console.warn('❌ Login fallito:', error);
    document.getElementById('rejected')?.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('rejected')?.classList.add('hidden');
    }, 1500);
  }
})
  checkLoggedIn() 
  }
function checkLoggedIn() {
  const restrictedPages = ['/carrito.html', '/productos.html', '/choosepoison.html', '/calculadores.html', '/user.html'];
  const accessPages = ['/index.html', '/signin.html', '/login.html'];
  if (restrictedPages.includes(location.pathname) && sessionStorage.getItem('user') == null) {
    location.href = './index.html'
  } else if (accessPages.includes(location.pathname) && sessionStorage.getItem('user') != null) {
    sessionStorage.setItem('user', null)
  }
}
function onLogOut(event) {
    event.preventDefault()
    // Eliminar la sesión del usuario
    sessionStorage.removeItem('user')
    location.href = './index.html'
  }

  function onSignOut() {
   console.log('borrar usuario')
    if (sessionStorage.getItem('user') && confirm('¿Estás seguro de borrar tu usuario?')) {
      let userId = JSON.parse(sessionStorage.getItem('user'))._id
      console.log(userId, typeof userId)
      let payload = JSON.stringify({ _id: userId })
      let apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/user/`, 'DELETE', payload);
      console.log(apiData)
       sessionStorage.removeItem('user')  
      alert('Usuario borrado correctamente') 
       location.href = './index.html' 
    }

  }
  function openSideBar(){
  console.log('lets open the menu')
  let underlay = document.getElementById('underlay')
  underlay.classList.remove('hidden')
  let sideBar = document.querySelector('.sidebar')
  sideBar.classList.add('active')
  }
  function openPopup(popUp, link) {
    let overlay = document.getElementById('overlay')
    if (popUp == null) return
    popUp.classList.add('active')
    overlay.classList.add('active')
 
    let titlePop = document.getElementById('pop-up-name');
    let bodyText = document.getElementById('pop-up-text');
    let h3 = link.querySelector('h3');
   
    titlePop.innerText = h3.innerText;
    // apri il popup
    overlay.classList.add('active');
    popUp.classList.add('active');
    // cambiar ficha de la receta en el pop up a partir de el nombre
    switch (titlePop.innerText.toLowerCase()) {
      case 'negroni':
         bodyText.innerText = 'Born in 1919 Florence, the Negroni blends gin, Campari, and sweet vermouth for a bold, bittersweet taste with herbal, citrus, and spiced notes—an Italian aperitivo classic. '
        break;
      case 'manhattan':
        bodyText.innerText = 'Created in 19th-century New York, the Manhattan mixes rye whiskey, sweet vermouth, and bitters—rich, smooth, and slightly spicy with cherry and herbal notes. A timeless, elegant classic.'
        break;
      case 'old fashioned':
        bodyText.innerText = 'Dating to the early 1800s, it combines bourbon or rye, sugar, bitters, and orange zest. Bold, smooth, and subtly sweet with a citrusy, aromatic twist. The original cocktail.'
        break;
      case 'dry martini':
        bodyText.innerText = 'Born in the early 20th century, it mixes gin and dry vermouth, garnished with olive or lemon. Crisp, clean, and botanical—a symbol of sophistication and minimalist elegance. '
        break;
      case 'tom collins':
        bodyText.innerText = 'A 19th-century gin cocktail of lemon juice, sugar, and soda water. Light, fizzy, and citrusy—like sparkling lemonade with a botanical twist. A refreshing, sunny-day drink. '
        break;
      case 'paloma':
        bodyText.innerText = 'A refreshing Mexican favorite of tequila and grapefruit soda (or juice + soda), often with lime and salt. Bright, tangy, and slightly bitter-sweet with a zesty, citrusy kick.'
        break;
      case 'dark & stormy':
        bodyText.innerText = 'Originating in Bermuda, this cocktail layers dark rum over ginger beer and lime. Spicy, rich, and invigorating with warming ginger heat and deep molasses notes. A sailor&rsquo;s delight. '
        break;
      case 'berry hiball':
        bodyText.innerText = 'Our latest creation! surprise your friends with a unique cocktail. Fruity, easy drinking, and refreshing with a hint of sweetness. '
        break;
      default:
        bodyText.innerText = '';
        break;
      }
       
   
      }

     function redirectToCalculadores() {
      let titlePop = document.getElementById('pop-up-name');
      let valueToStore = titlePop.textContent || titlePop.value;
      sessionStorage.setItem('choice', valueToStore);
        // reindirizza l'utente alla pagina calculadores.html
        console.log(valueToStore,'selected redirecting you to calculadores.html');
      
        window.location.href = './calculadores.html';

     }

     function autoSelectOption() {
      const chosenOption = sessionStorage.getItem('choice');
      if (!chosenOption) return;
    
      console.log(chosenOption, "✅ Retrieved and ready to pass to the web component.");
    
      const component = document.querySelector('calculador-component');
      if (component) {
        component.choice = chosenOption;  
      }
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
  const INITIAL_STATE = {
    users: [],// PASO 1
    botellas: [],
    isLoading: false,// Podría usarse para controlar cuando estamos realizando un fetch
    error: false,// Podría usarse para controlar cuando sucede un error
  }
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(sessionStorage.getItem('user') || defaultValue)
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
      console.log(headers)

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

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/botellas`, 'GET');
    
    console.log(apiData);

    apiData.forEach((botella) => {
      const producto = document.createElement('li');
      
      // Crea il bottone
      const button = document.createElement('button');
      button.textContent = 'Add to cart';
      button.classList.add('addToCart'); // Classe invece dell'id
      button.dataset.id = botella._id; // Usa dataset per salvare l'id

      // Aggiungi l'event listener direttamente qui
      button.addEventListener('click', () => {
        addToCart(botella._id); // Funzione da scrivere a parte
      });

      // Crea l'HTML del resto
      producto.innerHTML = `
       
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
      `;

      producto.appendChild(button); // Aggiungi il bottone creato
      listaProductos.appendChild(producto);
    });
 
  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  } 
}

async function buscarProducto(event) {
  event.preventDefault();

  try {
    const listaProductos = document.getElementById('listaProductos');
    const InputBusqueda = document.getElementById('busqueda');
    const valorBusqueda = InputBusqueda.value.trim(); // rimuove spazi iniziali/finali

    if (valorBusqueda === '') {
      alert('Debes ingresar un nombre de producto');
      return;
    }

    const newBotella = { name: valorBusqueda };
    const payload = JSON.stringify(newBotella);

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/busqueda`, 'POST', payload);

    if (apiData.length === 0) {
      alert('Producto no encontrado');
      return;
    }

   
    listaProductos.innerHTML = '';

    apiData.forEach((botella) => {
      const producto = document.createElement('li'); 

      producto.innerHTML = `
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
      `;

      const button = document.createElement('button');
      button.textContent = 'Add to cart';
      button.classList.add('addToCart');
      button.dataset.id = botella._id;
     

      button.addEventListener('click', () => {
        addToCart(botella._id);
      });

      producto.appendChild(button);
      listaProductos.appendChild(producto);
    });

  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  }
}


function onInputKeyUp(event) {// Keyup: mirar teclas pulsadas
  console.log(event.key)
   const listaProductos = document.getElementById('listaProductos');
   
  let formBusqueda  = document.getElementById('busqueda')
  if(formBusqueda.value  === ''){
    while (listaProductos.firstChild) {
      listaProductos.removeChild(listaProductos.firstChild)
    }
    displayProductos()
  }
}

async function addToCart(id){
try{
  console.log('add to cart',id)
  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
  const idBotellaNum = id
  const body = {
  idUser : idUserNum,
  idBotella: idBotellaNum,
 
}
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/push/to/cart`, 'POST', payload);
  alert('Added to your cart!')
    console.log(apiData)
    location.href = './carrito.html';

}
catch (error) {
  console.error('Error during botton click:', error);
}

}
 async function loadCartData() {

  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
  console.log('Loading the data', idUserNum);

  try {
    const payload = JSON.stringify({ id: idUserNum });
    console.log(payload);
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`, 'POST', payload);
   console.log(apiData);
    let idsInCart = apiData.cart;
    console.log(idsInCart);
 getbottlesFromShop(idsInCart)

    
  } catch (error) {
    console.error('Error during botton click:', error);
  }

}


  async function getbottlesFromShop(idsInCart) {
  console.log('up next getting this bottles from shop',idsInCart);

 try{
 
  const payloadCart = JSON.stringify({ ids: idsInCart });
  console.log(payloadCart);
  const apiDataCart = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/busqueda/cart`, 'POST', payloadCart);
     console.log(apiDataCart,typeof apiDataCart);
     if (apiDataCart.length === 0) {
  alert('No product found in DB');
  return;
}
const cartList = document.getElementById('carrito');
apiDataCart.forEach((botella) => {
  const producto = document.createElement('li'); 
  producto.innerHTML = `
      
        <img src="../img/imgProductos/${botella.name}.png" alt="${botella.name}">
        <h3>${botella.name}</h3>
        <p class="price">${botella.price} &euro;</p>
       
      `;
     cartList.appendChild(producto)
     const button = document.createElement('button');
      button.textContent = 'X';
      button.classList.add('delete-button');
      button.dataset.id = botella._id;
      let idBotellaNum = button.dataset.id 
      console.log(button.dataset.id,`botella.dataset.id`);
      button.addEventListener('click', () => {
        deleteItemFromCart(idBotellaNum);
      });
     
      producto.appendChild(button);
  
    
    
})

    let ClearCartButton = document.createElement('button');
    let mainCarrito = document.querySelector('.main-carrito')
    ClearCartButton.textContent = 'Clear Cart';
    ClearCartButton.classList.add('Clear');
     mainCarrito.appendChild(ClearCartButton);
    ClearCartButton.addEventListener('click', () => {
      clearCart();
    })
     }catch (error) {
    console.error('Error during botton click:', error);
     }
}
 
function deleteItemFromCart(idBotellaNum){
  console.log('delete from crt event lauched')
let userId = JSON.parse(sessionStorage.getItem('user'))._id
console.log(userId, idBotellaNum)

  const body = {
  idUser : userId,
  idBotella: idBotellaNum, 
 
}
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/from/cart`, 'DELETE', payload);
  console.log(apiData)
location.reload();

}
function clearCart(){
  console.log('clear cart event lauched')
  let userId = JSON.parse(sessionStorage.getItem('user'))._id
  console.log(userId)
  const body = {
    userId
  }
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/cart`, 'DELETE', payload);
  console.log(apiData)
  alert('Cart cleared!')
  location.reload(); 
}
function welcoming(){
  let pWelcome = document.getElementById('welcome')
  let userEmail = JSON.parse(sessionStorage.getItem('user')).email
  pWelcome.classList.add('p-welcome')
  pWelcome.textContent = `Welcome, ${userEmail}`
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
