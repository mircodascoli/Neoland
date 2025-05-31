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
  
  constructor() {
    super();
    this.apiData = null;
    try {
      this._idSession = JSON.parse(sessionStorage.getItem('user'))._id;
      console.log(this._idSession, 'id session storage catched!');
    } catch {
      console.warn('No user in sessionStorage');
      this._idSession = null;
    }
}
  
  async firstUpdated() {
    console.log('id session storage exists', this._idSession);
    if (this._idSession) {
      await this.loadApiData();
    }
  
  }
  
  async loadApiData() {
    console.log('Loading the data');
    const payload = JSON.stringify({ id: this._idSession });
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/buscar/usuario`, 'POST', payload);
  
    this.apiData = apiData;
    console.log(this.apiData, "valore di apidata, alla fine della funzione e prima del  render");
     
    this.requestUpdate()
     this.loadBottlesFromShop()
  }

    async  loadBottlesFromShop() {
    console.log('eooooo');
    let fourIngredients= `["${this.apiData.receta.ingredientes[0].dbname}","${this.apiData.receta.ingredientes[1].dbname}","${this.apiData.receta.ingredientes[2].dbname}","${this.apiData.receta.ingredientes[3].dbname}"]`
    console.log(fourIngredients, 'var four ingredients') 
    const keywords = fourIngredients.split(" "); // ["Apple", "laptop", "Lenovo", "phone"]
    console.log(keywords, 'var keywords') 
    const body = {keywords}
    const payload = JSON.stringify(body);
    const apiDataBottles = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/busqueda/party`, 'POST', payload);
  
    this.apiDataBottles = apiDataBottles;
    console.log(this.apiData, "valore di apidata, alla fine della funzione e prima del  render");
     
    this.requestUpdate()
  }

  clearRecipe(){
    console.log('clear recipe event lauched')
  let userId = JSON.parse(sessionStorage.getItem('user'))._id
  console.log(userId)
  const body = {
    userId
  }
  const payload = JSON.stringify(body);
   console.log(payload)
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/recipe`, 'DELETE', payload);
  console.log(apiData)
  alert('Recipe cleared!')
 location.reload();  
}
  render(){
    console.log(this.apiData, typeof this.apiData, "valore di apidata, nel render");
    return html`
      <div class="my-party"> 

        ${this.apiData
          ? html`
            <div class="thead">
              <p>Cocktail:${this.apiData.receta.name} </p>
              <p>${this.apiData.receta.quantity} mls</p>
            </div>
             <div class="tr">
               <p>${this.apiData.receta.ingredientes[0].name}</p>
               <p>${this.apiData.receta.ingredientes[0].quantity}ml</p>
              </div>
            <div class="tr">
               <p>${this.apiData.receta.ingredientes[1].name}</p>
               <p>${this.apiData.receta.ingredientes[1].quantity}ml</p>
             </div>
              <div class="tr">
                <p>${this.apiData.receta.ingredientes[2].name}</p>
                <p>${this.apiData.receta.ingredientes[2].quantity}ml</p>
              </div>
              <div class="tr">
                <p>${this.apiData.receta.ingredientes[3].name}</p>
                <p>${this.apiData.receta.ingredientes[3].quantity}ml</p>
              </div>
              </div>
      <div class="grab">
      <div class="grabth">
      <p>Grab your ingredients</p>
        </div>
     <ul>
          <li> ${this.apiData.receta.ingredientes[0].dbname} </li>
          <li> ${this.apiData.receta.ingredientes[1].dbname} </li>
          <li> ${this.apiData.receta.ingredientes[2].dbname} </li>
          <li> ${this.apiData.receta.ingredientes[3].dbname} </li>
        </ul>
        <div >
        </div>
      </div> 
        <div id="EraseOrUpdate">
        <button class="user-btn" id="erase"  @click="${this.clearRecipe}">Erase</button">
  
        <button class="user-btn" id="update" type="submit">Update</button>
     
   </div>`
          : html`<p>No Recipes Yet! start by <a href="/choosepoison.html">craft one</a></p>`}
      
    `;
  }
}
customElements.define('my-party', MyParty);