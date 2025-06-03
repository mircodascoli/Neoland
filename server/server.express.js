import express from 'express';
import { db } from "./server.mongodb.js";
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';

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
    console.log("hello from create users")
    
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


 // UPDATE     
 app.put('/update/users/:_id', async (req, res) => {
  res.json(await db.users.update(req.params._id, req.body))
  console.log('update', req.params._id, req.body)
})

// DELETE

 app.delete('/delete/user/', async (req, res) => {
    console.log('server delete user', req.body, typeof req.body)

    res.json(await db.users.delete(req.body._id))
      })  

 
  app.delete('/delete/from/cart', async (req, res) => {
    console.log('server delete from cart')
    
    res.json(await db.users.DeleteFromCart( req.body.idBotella, req.body.idUser))
   
      })

   app.delete('/delete/cart', async (req, res) => {
    console.log('server delete cart',req.body.userId, typeof req.body.userId)
    
    res.json(await db.users.clearCart( req.body.userId))
      })  

  app.delete('/delete/recipe', async (req, res) => {
    console.log('server delete recipe')

    res.json(await db.users.clearRecipe( req.body.userId))
      })  


    // FILTER

    app.post('/busqueda', async (req, res) => {
      console.log('estamos en busqueda', req.body)
      //recuerda añadir la projeccion para filtrar los ampos que devolvemos
         res.json(await db.botellas.search( { $text: { $search: req.body.name } },{}))
      })

    app.post('/busqueda/cart', async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log('Ricevuti questi ID:', ids);
    const objectIds = ids.map(id => new ObjectId(id));
    const botellas = await db.botellas.findByIds({ _id: { $in: objectIds } });
    res.json(botellas);
  } catch (error) {
    console.error('Error in express', error);
  }})

app.post('/busqueda/party', async (req, res) => {
  console.log('estamos en busqueda party', req.body);

  const keywords = req.body.keywords;
        console.log(keywords, typeof keywords, 'keywords in express');
  if (!Array.isArray(keywords)) {
    return res.status(400).json({ error: "Keywords should be an array of strings." });
  }

  try {
    const result = await db.botellas.findByNames(
      { name: { $in: keywords } }, 
      {}
    );
    res.json(result);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
   
         app.post('/push/to/cart', async (req, res) => {
      console.log('estamos para push to cart', req.body)
    
         res.json(await db.users.carting( req.body.idBotella, req.body.idUser))
      })

      app.post('/buscar/usuario', async (req, res) => {
        console.log('estamos en busqueda', req.body)
        //recuerda añadir la projeccion para filtrar los ampos que devolvemos
           res.json(await db.users.search(req.body))
           console.log(res.json)
        })


   app.post('/login', async (req, res) => {
    console.log('estamos en login', req.body)
    const user = await db.users.login({ email:req.body.email, password:req.body.password})
    res.json(user)
    
  })

  app.listen(port, async () => {
    console.log(` listening on port ${port}`);
  })
  


 