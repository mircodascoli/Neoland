import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getAPIData, getInputValue, API_PORT } from '../../main.js';
import ResetCSS from '../../../css/reset.css' with {type: 'css'};
import SignInFormCSS from '../SignInForm/SignInForm.css' with {type: 'css'};

export class SignInFormLit extends LitElement {
    static styles = [ResetCSS, SignInFormCSS];


    render() {
        return html`
            <form id="formLog"@submit="${this._onFormSubmit}">
                <slot></slot>
                <p id="infoMessage">Registro del usuario con lit</p>
                <input type="password" id="passwordSign" placeholder="Nombre de usuario" required>
                <input type="email" id="emailSign" placeholder="Email" required>
                <button type="submit" class="btn">Sign In</button>
            </form>
        `;
       
        }
        async _onFormSubmit(e) {
            e.preventDefault();
            const email = this.renderRoot.querySelector('#emailSign').value;
            const password = this.renderRoot.querySelector('#passwordSign').value;
           const signInData = {
              email: getInputValue(email),
              password: getInputValue(password)
            }
             //  let onFormSubmitEvent
          
             console.log(`DESDE DENTRO DEL COMPONENTE Name: ${signInData.email}, Email: ${signInData.password}`);
             if (signInData.email !== '' && signInData.password !== '') {
                const payload = JSON.stringify(signInData)
                const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', payload)
                console.log(apiData)
                // onFormSubmitEvent = new CustomEvent("login-form-submit", {
                //   bubbles: true,
                //   detail: apiData
                // })
              } else {
                console.error('No hay datos')
                //   bubbles: true,
                //   detail: null
                // })
              }
    }
}
customElements.define('signin-form-lit', SignInFormLit);