import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import MyPartyCSS  from '../myParty/MyPartyCSS.css' with { type: 'css' }
import { getAPIData, API_PORT } from '../../main.js'

export class MyParty extends LitElement {
    static styles = [
        ResetCSS, MyPartyCSS
    ]
    static get properties() {

   return{
    apiData: { type: Object }
   }
   
    }
    _idSession;
    loadApiData() {
        const varSS = JSON.parse(sessionStorage.getItem('user',))._id
       let idInSession = {_id: varSS}
           const payload = JSON.stringify(idInSession)
           console.log(payload)
           this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
           console.log(this._idSession);
        //    //Buscar en la BBDD si existe el usuario
        //    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/busqueda`, 'POST', payload)
        //    console.log(apiData)
      }

    constructor() {
        console.log('1. instanciando MyParty')
        super();
        
        this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
        console.log(this._idSession);
        // this.storageData = null;
        // this.loadStorageData();
       
    }

    render() {
        // if (!this.storageData) return html``; 
        return html`
            <div class="my-party"> 
                <h2>My Party</h2>
                
            </div>

        `;
    }
}  
customElements.define('my-party', MyParty);     
                           