import express from 'express';
import { db } from "./server.mongodb.js";
import bodyParser from 'body-parser';

const USERS_URL = './server/BBDD/users.json'
const BOTELLAS_URL = './server/BBDD/botellas.json'
const app = express();
const port = process.env.PORT;

// Static server
app.use(express.static('src'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// CREATE
app.post('/create/users', (req, res) => {
    db.create(USERS_URL, req.body, (data) => {
      console.log(`server create user ${data.name} creado`, data)
      res.send(JSON.stringify(data));
    });
  });
  app.post('/create/botellas', (req, res) => {
    db.create(BOTELLAS_URL, req.body, (data) => {
      console.log(`server create botellas ${data.name} creado`, data)
      res.send(JSON.stringify(data));
    });
  });

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

 app.put('/update/botellas' , (req, res) => {
    db.crud.update(BOTELLAS_URL, req.body.id, req.body, (data) => {
      console.log(`server update botellas ${data.name} modificado`, data)
      res.send(JSON.stringify(data));   
    })
})

app.put('/update/users' , (req, res) => {
    db.crud.update(USERS_URL, req.body.id, req.body, (data) => {
      console.log(`server update users ${data.name} modificado`, data)
      res.send(JSON.stringify(data));   
    })          
})


// DELETE
    app.delete('/delete/botellas', (req, res) => {
      db.deleteById(BOTELLAS_URL, req.body.id, (data) => {
        console.log(`server delete botellas ${data.name} borrado`, data)
        res.send(JSON.stringify(data));   
      })
    })

    app.delete('/delete/users', (req, res) => {
      db.deleteById(USERS_URL, req.body.id, (data) => {
        console.log(`server delete users ${data.name} borrado`, data)
        res.send(JSON.stringify(data));   
      })
    })      

    // FILTER

    app.post('/busqueda', async (req, res) => {
      console.log('estamos en busqueda', req.body)
      //recuerda añadir la projeccion para filtrar los ampos que devolvemos
         res.json(await db.botellas.search( { $text: { $search: req.body.name } },{}))
      })

   app.post('/login', (req, res) => {
     db.login(USERS_URL, req.body, (data) => {
       console.log(`server login ${data.name} modificado`, data)
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
  


  // db.stores.find( { $text: { $search: "java shop -coffee" } } )
