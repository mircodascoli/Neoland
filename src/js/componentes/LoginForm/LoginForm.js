import { importTemplate } from '../../lib/importTemplate.js';
import { getAPIData, getInputValue, API_PORT } from '../../main.js';

import ResetCSS from '../../../css/reset.css' with { type: 'css' };
import LoginFormCSS from './LoginForm.css' with { type: 'css' };


const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './js/componentes/LoginForm/LoginForm.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @property {string} prueba
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  static observedAttributes = ['prueba'];

  get prueba() {
    return this.getAttribute('prueba');
  }

  get template(){
    return document.getElementById(TEMPLATE.id);
  }

  constructor() {
    super()
  }

  // ======================= Lifecycle Methods ======================= //

  async connectedCallback() {
     console.log("constructor: Custom element added to page.");
     // Necesitamos activar el shadow DOM para poder añadir la plantilla html
    this.attachShadow({ mode: "open" });
     // Asignamos los estilos
    this.shadowRoot.adoptedStyleSheets.push(ResetCSS, LoginFormCSS);
   // Creamos el contenido del shadowRoot
    this._setUpContent();
    // Ahora que ya existe el shadowRoot, podemos asignar eventos a nuestro HTML
    const loginForm = this.shadowRoot.getElementById("formLog");
    // Get updates when content is updated in the slot
    this.shadowRoot.addEventListener('slotchange', this._handleSlotChanged.bind(this), { passive: true });
    // Global store state listener
    // window.addEventListener('stateChanged', this._handleStateChanged.bind(this), { passive: true });

    loginForm.addEventListener("submit", this._onFormSubmit.bind(this));
  }

  disconnectedCallback() {
    console.log("disconnectedCallback: Custom element removed from page.");
    // Don't forget to remove event listeners
    // window.removeEventListener('stateChanged', this._handleStateChanged);
  }

  adoptedCallback() {
    console.log("adoptedCallback: Custom element moved to new page.");
  }


  /**
   * Called when an observed attribute has changed.
   *
   * @param {String} name - The name of the attribute that changed.
   * @param {String} oldValue - The old value of the attribute.
   * @param {String} newValue - The new value of the attribute.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
    this._setUpContent();
  }

  // ======================= Private Methods ======================= //

  /**
   * Private method to set up the content of the web component.
   *
   * Only render if the web component is connected and the template is loaded.
   * Replace any previous content with the template content.
   * @private
   */
  _setUpContent() {
    // Prevent render when disconnected or the template is not loaded
    if (this.shadowRoot && this.template) {
      // Replace previous content
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }

  /**
   * Handles a slot change event from the shadow root
   * @param {Event} e - The slot change event
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _handleSlotChanged(e) {
    // Notify the slot change event
    // console.log(['Slot changed', e])
  }
 

/**
 * Handles the form submission event for the login form.
 * Prevents the default form submission behavior and gathers
 * the user's email and password input values. If both fields
 * are filled, sends a POST request to the login API endpoint
 * with the login data. Dispatches a custom event with the API
 * response data if the login is successful, otherwise dispatches
 * an event with null detail.
 *
 * @param {Event} e - The form submission event.
 * @private
 */

  async _onFormSubmit(e) {
    e.preventDefault();
    const email = this.shadowRoot.getElementById("emailLog");
    const password = this.shadowRoot.getElementById("passwordLog");
    const loginData = {
      email: getInputValue(email),
      password: getInputValue(password)
    }
    let onFormSubmitEvent
    console.log(`DESDE DENTRO DEL COMPONENTE Email: ${loginData.email}, Password: ${loginData.password}`);

    if (loginData.email !== '' && loginData.password !== '') {
      const payload = JSON.stringify(loginData)
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/login`, 'POST', payload)
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
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: apiData
      })
    } else {
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: null
      })
    }

    this.dispatchEvent(onFormSubmitEvent);
  }
}

customElements.define('login-form', LoginForm);