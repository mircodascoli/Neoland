// @ts-no-check

// MODEL
export class User {
  /**
   * @param {string} email
   * @param {string} [password='']
   * @param {string} name
   * @param {'user' | 'admin'} [rol='user']
   * @param {string} [token='']
   */
  constructor(email, password = '', rol='user', token ='',) {

    this.email = email
    this.password = password
    this.token= token
    this.rol= rol
    
  
 
   
 

   
 
   
  }
}


// export class User {
//   /**
//    * @param {string} name
//    * @param {string} email
//    * @param {'user' | 'admin'} [rol='user']
//    * @param {string} [password='']
//    * @param {string} [token='']
//    * @param {string} [_id='']
//    */
//   constructor(name, email, rol = 'user', password = '', token = '', _id = '') {
//     if (_id === '') {
//       const timestamp = new Date()
//       // Generar id aleatorio (hasta que tengamos el de la BBDD)
//       this._id = String(timestamp.getTime())
//     } else  {
    //   this._id = _id
    // }