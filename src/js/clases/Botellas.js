
export class Botellas{
   
    /**
     * @param {string} brand
     * @param {'whisky' | 'vermouth' | 'gin' | 'tequila'} type
     * @param {number} [mls=700] - The volume of the bottle in milliliters
     * @param {'basic'| 'recomended'| 'premium'} [range = 'recomended'] - The range or series of the bottle. {basic, recomended, premium} [range - The range or series of the bottle. 
     * 
    */

      constructor(brand, type, mls = 700, range = 'recomended') {
        
    
      this.brand = brand// makers-mark, cocchi, Patron
      this.type = type // whisky, vermouth, gin, tequila ....
      this.mls = mls// 700 casi siempre
      this.range = range // basic, recomended, premium
    
      }
    
    }
    

//     /**
//  * @typedef {'leche' | 'carne' | 'fruta' | 'verdura' | 'grasas' | 'azucar' | 'sal' | 'huevos' | 'aceite'} Ingrediente
//  */

// /**
//  * @typedef {Ingrediente[]} Ingredientes
//  */