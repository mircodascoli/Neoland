import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import LogInFormCSS from '../LoginFormLit/LoginFormCSS.css' with { type: 'css' }

export class LoginInFormLit extends LitElement {
    static styles = [ResetCSS, LogInFormCSS];

    render() {
        return html`
            <form id="formSign">
                <slot></slot>
                <p id="infoMessage">Registro del usuario con lit</p>
                <input  type="email" id="emailLog"placeholder="Your email" minlength="3" required>
                 <input type="password" id="passwordLog" placeholder="Your password" minlength="3" required>
                <button type="submit" id="loginButton" title="Login">Login</button>
            </form>
        `;
    }
}
customElements.define('log-in-form-lit', LoginInFormLit);