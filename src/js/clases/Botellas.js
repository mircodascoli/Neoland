
export class Botellas{
   
    /**
     * @param {number} _id
     * @param {string} name
     *  @param {number} price
     * @param {number} [ml=700] - The volume of the bottle in milliliters
     * @param {string} spirit
     * @param {'basic'| 'recommended'| 'premium'} [range = 'recomended'] - The range or series of the bottle. {basic, recomended, premium} [range - The range or series of the bottle. 
     * @returns {Botellas}
    */

      constructor(_id, name, price, ml = 700, spirit, range = 'recommended'){
        
      this._id = _id// 1, 2, 3...
      this.name = name// makers-mark, cocchi, Patron
      this.price = price
      this.ml = ml// 700 casi siempre
      this.spirit = spirit// whisky, vermouth, gin, tequila ....
      this.range = range // basic, recomended, premium
  
      
    
      }
    
    }



//     /**
//  * @typedef {'leche' | 'carne' | 'fruta' | 'verdura' | 'grasas' | 'azucar' | 'sal' | 'huevos' | 'aceite'} Ingrediente
//  */

// /**
//  * @typedef {Ingrediente[]} Ingredientes
//  */