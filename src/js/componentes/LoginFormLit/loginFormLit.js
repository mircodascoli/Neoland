import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import LogInFormCSS from '../LoginFormLit/LoginFormCSS.css' with { type: 'css' }
import { getAPIData, API_PORT } from '../../main.js'

export class LoginInFormLit extends LitElement {
    static styles = [ResetCSS, LogInFormCSS];
    
    static properties = {
        email: {type: String},
        password: {type: String}
      };
      constructor() {
        super();
      }
    
    render() {
        return html`
            <form id="formSign" @submit="${this._onFormSubmit}">
                <slot></slot>
                <p id="infoMessage">Registro del usuario con lit</p>
                <input  type="email" id="emailLog"placeholder="Your email" minlength="3" required>
                 <input type="password" id="passwordLog" placeholder="Your password" minlength="3" required>
                 <button type="submit" id="loginButton" title="Login" ?disabled=${this.email === '' || this.password === ''}>Login</button>
            </form>
        `;
    }
    // Property binding methods
  _emailChanged(e) {
    this.email = e.target.value
  }

  _passwordChanged(e) {
    this.password = e.target.value
  }

  // Event listeners
  async _onFormSubmit(e) {
    e.preventDefault();
    // Prevent autofill problems
    const emailElement = this.renderRoot.querySelector('#emailLog')
    const passwordElement = this.renderRoot.querySelector('#passwordLog')
    const email = this.email || emailElement.value;
    const password = this.password || passwordElement.value;
    const loginData  = {
      email,
      password
    }
    let onFormSubmitEvent
    if (loginData.email !== '' && loginData.password !== '') {
     const payload = JSON.stringify(loginData)
      console.log(payload)
      let apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/login`, 'POST', payload)
      console.log(apiData)
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
customElements.define('log-in-form-lit', LoginInFormLit);