import fs from 'fs';

export async function busqueda(file, botellaData, callback) {
  let productFound = []
  console.log('filter', botellaData);
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        productFound = parsedData.filter((producto) => {
            console.log(producto)
          return producto.name.includes(botellaData.name) || producto.spirit.includes(botellaData.name)
        });
        if (productFound.length === 0) {
          console.log('read', 'No se encontraron resultados');
          if (callback) {
            return callback('No se encontraron resultados');
          }
          return [];
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          return callback(productFound);
        }
        return productFound
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