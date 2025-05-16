import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, getInputValue, API_PORT } from '../../main.js';
import ResetCSS from '../../../css/reset.css' with {type: 'css'};
import SignInFormLitCSS from '../SignInFormLit/SignInFormLit.css'with {type: 'css'};
export class SignInFormLit extends LitElement {
    static styles = [ResetCSS, SignInFormLitCSS];


    render() {
        return html`
            <form id="formLog" @submit="${this._onFormSubmit}">
                <slot></slot>
                <p id="infoMessage">Register your account</p>
                <input type="email" id="emailSign" placeholder="Email" required>
                <input type="password" id="passwordSign" placeholder="Password" required>
                <button type="submit" class="btn">Sign In</button>
                <a href="./login.html" class="login-or-sign">Or login</a>
            </form>
        `;
       
        }

        async _onFormSubmit(e) {
          console.log('onFormSubmit activation')
            e.preventDefault();
           
            const email = this.renderRoot.getElementById('emailSign');
            const password = this.renderRoot.getElementById('passwordSign')
            

            const signInData  = {
              email: getInputValue(email),
              password: getInputValue(password)
            }

           let onFormSubmitEvent
          
             console.log(`DESDE DENTRO DEL COMPONENTE Name: ${signInData.email}, Email: ${signInData.password}`);

             if (signInData.email !== '' && signInData.password !== '') {

                const payload = JSON.stringify(signInData)
                const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', payload)
                console.log(apiData)
                let eventDetail = apiData

                   if (apiData === undefined) { 

                         eventDetail = { text: 'User already exists',}
                        }
  
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: eventDetail
      })
    } else {
      console.error('No se han enviado datos')
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: {
          text: 'No se han enviado los datos del formulario'
        }
      })
    }

     this.dispatchEvent(onFormSubmitEvent);
  }
    }

customElements.define('signin-form-lit', SignInFormLit);