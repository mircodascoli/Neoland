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
                <p id="infoMessage">Get Back to your account</p>
                <input  type="email" id="emailLog"placeholder="Your email" minlength="3" required>
                 <input type="password" id="passwordLog" placeholder="Your password" minlength="3" required>
                 <button type="submit" class="btn" title="Login" ?disabled=${this.email === '' || this.password === ''}>Login</button>
                  <a href="./sign.html" class="login-or-sign">Or Sign Up</a>
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

  const emailElement = this.renderRoot.querySelector('#emailLog');
  const passwordElement = this.renderRoot.querySelector('#passwordLog');
  const email = this.email || emailElement.value;
  const password = this.password || passwordElement.value;

  const loginData = { email, password };

  let eventDetail = {
    success: false,
    data: null,
    error: null
  };

  if (email !== '' && password !== '') {
    try {
      const payload = JSON.stringify(loginData);
      const apiData = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/login`,
        'POST',
        payload
      );

      if (apiData) {
        const userSession = JSON.stringify(apiData);
        sessionStorage.setItem('user', userSession);
        document.body.classList.add('loading');

        eventDetail.success = true;
        eventDetail.data = apiData;

        setTimeout(() => {
          location.href = './user.html';
        }, 1000);
      } else {
        eventDetail.error = 'Login fallito: risposta API nulla';
      }

    } catch (error) {
      console.error('Errore nella richiesta login:', error);
      eventDetail.error = 'Errore di rete o API';
    }
  } else {
    eventDetail.error = 'Email o password mancanti';
  }

  const onFormSubmitEvent = new CustomEvent('login-form-submit', {
    bubbles: true,
    detail: eventDetail
  });

  this.dispatchEvent(onFormSubmitEvent);
}

}
customElements.define('log-in-form-lit', LoginInFormLit);