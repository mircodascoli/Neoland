/* eslint-disable no-undef */
import { suma } from '../libreria/suma.js'
describe('Voy a probar que se realiza la suma correctamente', () => {
    test('sumar 1 + 2 es igual a 3', () => {
        expect(suma(1, 2)).toBe(3);
      });
    
})


