import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import ResetCSS from '../../../css/reset.css' with { type: 'css' }
import CalculadorCSS from '../calculador/calculador.css' with { type: 'css' }
export class Calculador extends LitElement{
    static styles = [
        ResetCSS, CalculadorCSS
    ]
    render(){
        return html `
        <div class="container-calculador">
       
        <div id="inputscalculador">

         <label for="seleccionador">of: </label><select name="coktails" id="seleccionador">
        
          
            <option value="0" selected>i would like...</option>
            <option value="Negroni" >Negroni</option>
            <option value="Manhattan">Manhattan</option>
            <option value="Dry Martini">Dry Martini</option>
            <option value="Old Fashioned">Old Fashioned</option>
            <option value="Paloma">Paloma</option>
            <option value="Dark & Stormy">Dark & Stormy</option>
            <option value="Tom Collins">Tom Collins</option>
            <option value="Berry Hiball">Berry Hiball</option>
           
        </select>
        <label for="range" id="label-range">Quantity:</label> <input  id="range" type="range" min="200" max="2000" step="100" value="1000"></input>
        </div>
       
        <div id="resultados">
           <table id="tabla-calculos" cellspacing="1px" cellpadding="">
            <thead>
                <th>ingredients:</th>
                <th id>quantity:</th>
            </thead>
            <tbody>
                <tr id="row-ingrediente-1">
                    <td id="ingrediente-1">undf</td>
                    <td id="mls-ingrediente-1">00</td>
                </tr>
                <tr id="row-ingrediente-2">
                    <td id="ingrediente-2">undf</td>
                    <td id="mls-ingrediente-2">00</td>
                </tr>
                <tr id="row-ingrediente-3">
                    <td id="ingrediente-3">undf</td>
                    <td id="mls-ingrediente-3">00</td>
                </tr>
                <tr id="row-ingrediente-4">
                    <td id="ingrediente-4">undf</td>
                    <td id="mls-ingrediente-4">00</td>
                </tr>
              

             </tbody>
           </table>
            <button id="save"> save and party!</button>
        </div>

    </div> `;
 }
}
customElements.define('calculador-component', Calculador);