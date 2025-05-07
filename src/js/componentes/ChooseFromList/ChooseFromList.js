// import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
// import ResetCSS from '../../../css/reset.css' with { type: 'css' }
// import ChooseFromListCSS from '../ChooseFromList/ChooseFromList.css' with { type: 'css' }
// import { cocktails } from '../../clases/Cocktails.js';

// export class ChooseFromList extends LitElement {
//     static get properties() {
//         return {
           
//         }
//     }

//     constructor() {
//       super();
  
//     }


//     render() {
//         return html`
//             <ul>
//             ${this.cocktails.map(cocktail => html`<a data-modal-target="#description">
//                     <li class="item-cocktail-list">
//                         <img src="./img/paloma.jpeg" alt="Paloma" class="img-list-cocktails">
//                         <h3>${cocktail.name}</h3>
//                     </li>
//                 </a>
//                 `)}
//             </ul>
//         `;          
//     }
// }
// customElements.define('calculador-component', ChooseFromList);