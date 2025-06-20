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
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/buscar/usuario`, 'POST', payload);
  
    this.apiData = apiData;
    console.log(this.apiData, "valore di apidata, alla fine della funzione e prima del  render");
     
    this.requestUpdate()
     this.loadBottlesFromShop()
  }

   async loadBottlesFromShop() {
  const ingredientes = this.apiData.receta.ingredientes;
  const keywords = ingredientes.map(ing => ing.dbname); // array
  const body = { keywords };
   
    const payload = JSON.stringify(body);
    console.log(payload, typeof payload, 'payload');
    const apiDataBottles = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/busqueda/party`, 'POST', payload);
  
    this.apiDataBottles = apiDataBottles;
    console.log(this.apiDataBottles, "valore di apidatabottles")
     
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
  const apiData = getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/recipe`, 'DELETE', payload);
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
        ${this.apiDataBottles && this.apiDataBottles.length > 0 ? html`
    <ul>
        ${this.apiDataBottles.map(
          (bottle) => html`
            <li class="botella-my-party">
              <img
                src="../img/imgProductos/${bottle.name}.png"
                alt="${bottle.name}"
              />
              <h3 class="name-botella">${bottle.name}</h3>
              <p class="price">${bottle.price} &euro;</p>
              <button
                class="AddToCart"
                data-id="${bottle._id}"
                @click="${this.addToCart}"
              >
                Add to cart
              </button>
            </li>
          `
        )}
      </ul>
        <div >
        </div>
      </div> 

        <div id="eraseOrUpdate">
        <button class="user-btn" id="erase"  @click="${this.clearRecipe}">Erase</button">
        <button class="user-btn" id="update" type="submit">Update</button>
      </div>`
          : html`<p>No ingredients found</p>`}
     ` : html`<p id="noRecipes">Start <a href="/choosepoison.html">crafting</a> your first recipe</p>`}
    `;
  }

 async addToCart(event) {

  const id = event.target.getAttribute('data-id');
  console.log(id)
  const idUserNum = JSON.parse(sessionStorage.getItem('user'))._id
  const idBotellaNum = id
  const body = {
    idUser : idUserNum,
    idBotella: idBotellaNum,
  }
  const payload = JSON.stringify(body);
  console.log(payload)
  const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/push/to/cart`, 'POST', payload);
  console.log(apiData)
  alert('Added to your cart! ')
}

}
customElements.define('my-party', MyParty);