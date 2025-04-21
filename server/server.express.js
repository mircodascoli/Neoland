import express from 'express';
import crud from './server.crud.js';
const USERS_URL = './server/BBDD/users.json'

const app = express();
const port = process.env.PORT;



app.get('/', (req, res) => {
  res.send('Hello World!')
})
// CREATE
app.post('create/users', (req, res) => {
  res.send('User created!')
})
// // READ
app.get('/users', (req, res) => {
    crud.create(USERS_URL, req.body, (data) => {
     console.log(`server create user ${data.name} creado`, data)
                      
  res.send(JSON.stringify(data));
})
})
// // UPDATE
// app.put('/users/:id', (req, res) => {
//   res.send('User updated!')
// })
// // DELETE
// app.delete('/users/:id', (req, res) => {
//   res.send('User deleted!')
// })
app.listen(port, async () => {
    console.log(` listening on port ${port}`);
  })
  