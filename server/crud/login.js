import fs from 'fs';

export async function login(file, userData, callback) {
  let userFound = []
  const userNotFoundError = {
    error: true,
    message: 'login: No se encontraron resultados'
  }
  console.log('login', userData);
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const userList = JSON.parse(data.toString());
        userFound = userList.filter((user) => {
          return user.email === userData.email && user.name === userData.name
        })
        // Filter by filterParams
       
        if (userFound.length === 0) {
            console.log(userNotFoundError);
            if (callback) {
              return callback(userNotFoundError);
            }
            return []
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          return callback(userFound);
        }
        return userFound
      });
    } else {
      console.log('filter', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('filter', `Error: ${err}`);
    return err;
  }
}