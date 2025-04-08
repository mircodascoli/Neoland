
export class Botellas{
   
    /**
     * @param {string} brand
     * @param {'whisky' | 'vermouth' | 'gin' | 'tequila'} type
     * @param {number} [mls=700] - The volume of the bottle in milliliters
     * @param {'basic'| 'recomended'| 'premium'} [range = 'recomended'] - The range or series of the bottle. {basic, recomended, premium} [range - The range or series of the bottle. 
     * @param {string} _id
    */

      constructor(brand, destilado, mls = 700, range = 'recomended', _id) {
        
    
      this.brand = brand// makers-mark, cocchi, Patron
      this.destilado = destilado// whisky, vermouth, gin, tequila ....
      this.range = range // basic, recomended, premium
      this._id = _id// 1, 2, 3...
      this.mls = mls// 700 casi siempre
      }
    
    }

    class Destilado{
      constructor()
    }
    


//     /**
//  * @typedef {'leche' | 'carne' | 'fruta' | 'verdura' | 'grasas' | 'azucar' | 'sal' | 'huevos' | 'aceite'} Ingrediente
//  */

// /**
//  * @typedef {Ingrediente[]} Ingredientes
//  */