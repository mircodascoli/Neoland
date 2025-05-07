import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import MyPartyCSS  from '../myParty/MyPartyCSS.css' with { type: 'css' }
import { getAPIData, API_PORT } from '../../main.js';

export class MyParty extends LitElement {
    static styles = [
        ResetCSS, MyPartyCSS
    ]
    static get properties() {
        return {
            party: { type: Object }
        }
    }

    constructor() {
        super();
        this.party = {};
    }

    render() {
        return html`
            <div class="my-party"> 
                <h2>My Party</h2>
                <p>cocktail: </p>
                <p>(quantity)</p>
                <p>recipe</p>
            </div>
    
        `;
    }
}  
customElements.define('my-party', MyParty);     
                           