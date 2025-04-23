import express from 'express';
import {crud} from './server.crud.js';
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// CREATE
app.post('/create/users', (req, res) => {
    crud.create(USERS_URL, req.body, (data) => {
      console.log(`server create user ${data.name} creado`, data)
      res.send(JSON.stringify(data));
    });
  });
  app.post('/create/botellas', (req, res) => {
    crud.create(BOTELLAS_URL, req.body, (data) => {
      console.log(`server create botellas ${data.name} creado`, data)
      res.send(JSON.stringify(data));
    });
  });

// READ
app.get('/read/users', (req, res) => {
    crud.read(USERS_URL, (data) => {
      console.log('server read users', data)
  
      res.send(JSON.stringify(data));
    });
  });
  app.get('/read/botellas', (req, res) => {
    crud.read(BOTELLAS_URL, (data) => {
      console.log('server read botellas', data)
  
      res.send(JSON.stringify(data));
    });
  });

 // UPDATE

 app.put('/update/botellas' , (req, res) => {
    crud.crud.update(BOTELLAS_URL, req.body.id, req.body, (data) => {
      console.log(`server update botellas ${data.name} modificado`, data)
      res.send(JSON.stringify(data));   
    })
})

app.put('/update/users' , (req, res) => {
    crud.crud.update(USERS_URL, req.body.id, req.body, (data) => {
      console.log(`server update users ${data.name} modificado`, data)
      res.send(JSON.stringify(data));   
    })          
})


// DELETE
    app.delete('/delete/botellas', (req, res) => {
      crud.deleteById(BOTELLAS_URL, req.body.id, (data) => {
        console.log(`server delete botellas ${data.name} borrado`, data)
        res.send(JSON.stringify(data));   
      })
    })

    app.delete('/delete/users', (req, res) => {
      crud.deleteById(USERS_URL, req.body.id, (data) => {
        console.log(`server delete users ${data.name} borrado`, data)
        res.send(JSON.stringify(data));   
      })
    })      

    // FILTER

    app.post('/busqueda', (req, res) => {
      crud.busqueda(BOTELLAS_URL, req.body, (data) => {
        console.log(`server busqueda botellas ${data.name} modificado`, data)
        res.send(JSON.stringify(data));   
      })
    })

   app.post('/login', (req, res) => {
     crud.login(USERS_URL, req.body, (data) => {
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
  