// @ts-check

/** @import { User } from "./User.js"*/    
export class SingletonDB {
   /**
   * @type {User[] | undefined}
   */
    dataBase
    constructor(){
      // console.log('construyo el singleton de la base de datos')
    }
    /**
     * Returns the dataBase array.
     *
     * If the database is uninitialized, it is initialized with an empty array.
     *
     * @returns {User[] } dataBase
     */
    get() {
      if (this.dataBase === undefined) {
        this.dataBase = []
      }
      return this.dataBase
    }
    push() {
      if (this.dataBase === undefined){
        this.dataBase = []
      }
      this.dataBase.push(...arguments)
    }
  }