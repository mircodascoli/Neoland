// @ts-check

// MODEL
export class User {
  /**
   * @param {string} name
   * @param {string} email
   * @param {'user' | 'admin'} [rol='user']
   * @param {string} [password='']
   * @param {string} [token='']
   */
  constructor(name, email, rol='user', password = '', token ='',) {
    const timestamp = new Date()

    this._id = String(timestamp.getTime())
    this.name = name
    this.email = email
    this.rol= rol
    this.password = password
    this.token= token
  }
}


