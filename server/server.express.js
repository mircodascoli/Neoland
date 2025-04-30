import express from 'express';
import { db } from "./server.mongodb.js";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;

// Static server
app.use(express.static('src'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))



// CREATE

  app.post('/create/botellas', async (req, res) => {
    console.log('server reate botellas')
    res.json(await db.botellas.get())
  });
  
  app.post('/create/users', async (req, res) => {
    // 1. Comprobar si ya existe el usuario, usando getUsers
    const userExists = await db.users.get({ email: req.body.email})
    // 2. Si no existe, crearlo
    if (userExists.length === 0) {
      // Remove _id property from payload object
      const newUser = req.body
      delete newUser._id
      res.json(await db.users.create(newUser))
    } else {
      res.status(400).send('User already exists')
    }
  })


// READ
app.get('/read/users', async (req, res) =>  {
      console.log('server read users')
      res.json(await db.users.get())
    });


  app.get('/read/botellas', async (req, res) => {
      console.log('server read botellas')
      res.json(await db.botellas.get())
    });


  app.get('/count/users',async (req, res) => {
      const usuarios = await db.users.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
    });

 // UPDATE     

 app.put('/update/users/:user', async (req, res) => {
  const userId = sessionStorage.getItem('_id');
  console.log('estamos en update', userId,req.params.id)
  res.json(await db.users.update(userId, req.body))
})
// DELETE
 
    app.delete('/delete/users', () => {
    
      })
      

    // FILTER

    app.post('/busqueda', async (req, res) => {
      console.log('estamos en busqueda', req.body)
      //recuerda añadir la projeccion para filtrar los ampos que devolvemos
         res.json(await db.botellas.search( { $text: { $search: req.body.name } },{}))
      })

   app.post('/login', async (req, res) => {
    console.log('estamos en login', req.body)
    const user = await db.users.login({ email:req.body.email, password:req.body.password})
    res.json(user)
    
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
  


  // db.stores.find( { $text: { $search: "java shop -coffee" } } )
