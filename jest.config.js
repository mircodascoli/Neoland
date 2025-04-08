// @ts-check

/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^clases/(.*)': '<rootDir>/src/js/clases/*.js',
      '^libreria/(.*)': '<rootDir>/src/js/libreria/*.js',
      
     
    }
  }
  
  export default config