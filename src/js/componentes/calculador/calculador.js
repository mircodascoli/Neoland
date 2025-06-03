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

  render() {
    console.log(this.choice, 'the choice in the elementcalculador');
    return html`
      <div class="container-calculador">
        <slot></slot>
        <div id="inputscalculador">
          <p>${this.choice}</p>
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
            ? html`<p class="total-ml"> Total: <strong>${this.totalMl} ml</strong></p>`
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
