// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { create } from './crud/create.js';
import { read } from './crud/read.js';
import { update } from './crud/update.js';
import { deleteById } from './crud/delete.js';
import { filterByName } from './crud/filterName.js';
import { filterById } from './crud/filterId.js';
import { filterByRange } from './crud/filterrange.js';
import {filterBySpirit} from './crud/filterspirits.js';



export const crud = {
  create: (file, data, callback) => create(file, data, callback),
  read: (file, callback) => read(file, callback),
  update: (file, id, data, callback) => update(file, id, data, callback),
  delete: (file, id, callback) => deleteById(file, id, callback),
  filterByName: (file, filterParams, callback) => filterByName(file, filterParams, callback),
  filterById: (file, filterParams, callback) => filterById(file, filterParams, callback),
  filterByRange: (file, filterParams, callback) => filterByRange(file, filterParams, callback),
  filterBySpirit: (file, filterParams, callback) => filterBySpirit(file, filterParams, callback),
}