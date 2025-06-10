import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import CalculadorCSS from '../calculador/calculador.css' with { type: 'css' }
import { cocktails } from '../../clases/Cocktails.js';
import { getAPIData, API_PORT } from '../../main.js';

export class Calculador extends LitElement {
  static styles = [ResetCSS, CalculadorCSS];

  static properties = {
    selected: { state: true },
    quantity: { state: true },
    choice: { state: true }
  };

  constructor() {
    super();
    this.selected = '';
    this.choice = '';
    this.quantity = 500;
  }

  updated(changedProperties) {
    if (changedProperties.has('choice')) {
      console.log(this.choice, 'the choice update');
      if (cocktails[this.choice]) {
        console.log(`cocktails[this.choice]: ${cocktails[this.choice]}`);
        this.selected = this.choice;
      } else {
        console.log(`Cocktail "${this.choice}" non è presente nella lista.`);
      }
    }
  }

  get theChoice() {
    console.log(this.choice, 'the choice in the elementcalculador');
    return this.choice;
  }

  get ingredients() {
    if (!this.selected || !cocktails[this.selected]) return [];

    const receta = cocktails[this.selected];
    const totalPercent = receta.reduce((sum, i) => sum + i.percent, 0);

    return receta.map(i => ({
      name: i.name,
      quantity: Math.round((i.percent / totalPercent) * this.quantity),
      dbname: i.dbname
    }));
  }

  get totalMl() {
    return this.ingredients.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPp() {
    return this.ingredients.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }

  render() {
    console.log(this.choice, 'the choice in the elementcalculador');
    return html`
      <div class="container-calculador">
        <slot></slot>
        <div id="inputscalculador">
       
          <label for="seleccionador">of: </label>
          <select name="coktails" id="seleccionador" @change="${this.handleSelect}">
            <option value="" selected>i would like...</option>
            ${Object.keys(cocktails).map(name => html`
              <option value="${name}" ?selected=${this.selected === name}>${name}</option>
            `)}
          </select>

          <label for="range" id="label-range">Quantity:</label>
          <input id="range" type="range" min="200" max="1000" step="100"
                 .value=${this.quantity}
                 .disabled=${!this.selected}
                 @input=${this.handleRange}/>
        </div>

        ${!this.selected ? html`<p class="alert">🍹 Please select a cocktail to see the ingredients.</p>` : null}

        <div id="resultados">
          <table id="tabla-calculos" cellspacing="1px" cellpadding="">
            <thead>
              <th>ingredients:</th>
              <th>quantity:</th>
            </thead>
            <tbody>
              ${this.ingredients.map(i => html`
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity} ml</td>
                </tr>
              `)}
            </tbody>
          </table>
          ${this.selected
            ? html`<p class="total-ml"> Total: <strong>${this.totalMl} ml <svg fill="#ffffff" class="people" width="64px" height="64px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg></strong></p>`
            : null}
          <button id="save" @click="${this.handleClick}" .disabled=${!this.selected}>save and party!</button>
        </div>
      </div>
    `;
  }

  handleSelect(e) {
    this.selected = e.target.value;
    
  }

  handleRange(e) {
    this.quantity = parseInt(e.target.value);
  }

  async handleClick() {
    await this.guardarReceta();
  }

  async guardarReceta() {
    const receta = {
      name: this.selected,
      quantity: this.quantity,
      ingredientes: this.ingredients,
      dbname: this.dbname
    };

    const sessionStorageUser = JSON.parse(sessionStorage.getItem('user'));
    const sessionStorageUserId = sessionStorageUser._id;
    const dataForUpdate = { receta: receta };
    const PAYLOAD = JSON.stringify(dataForUpdate);

    console.log("esta es PAYLOAD ", PAYLOAD);
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/users/${sessionStorageUserId}`, 'PUT', PAYLOAD);
    console.log("esta es apidata", apiData);

    alert('Saved!');
    location.href = './user.html';
  }
}

customElements.define('calculador-component', Calculador);
