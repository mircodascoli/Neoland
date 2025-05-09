import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import MyPartyCSS  from '../myParty/MyPartyCSS.css' with { type: 'css' }
import { getAPIData, API_PORT } from '../../main.js'

export class MyParty extends LitElement {
  static styles = [
    ResetCSS, MyPartyCSS
  ]
  static get properties() {
    return {
      apiData: { type: Object }
    }
  }

  _idSession;
  apiData;

  async loadApiData() {
    const varSS = JSON.parse(sessionStorage.getItem('user'))._id
    let idInSession ={id: varSS}
    const payload = JSON.stringify(idInSession)
    console.log(payload)
    this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
    console.log(this._idSession);
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/buscar/usuario`, 'POST', payload)
    console.log(apiData)
    this.apiData = apiData;
  }

  constructor() {
    super();
    this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
    console.log(this._idSession);
    this.loadApiData.bind(this)();
  }

  render() {
    return html`
      <div class="my-party"> 
        <h2>My Party</h2>
        ${this.apiData ? html`
          <p>API Data: ${JSON.stringify(this.apiData)}</p>
        ` : html`
          <p>Loading...</p>
        `}
      </div>
    `;
  }
}

customElements.define('my-party', MyParty);