import express, { Router }  from 'express';
import bodyParser from 'body-parser';
import { ObjectId, MongoClient } from 'mongodb';
import serverless from 'serverless-http';
const port = process.env.PORT;

const URI = process.env.MONGO_ATLAS;
const api = express();
const router = Router();


// CREATE

  router.post('/api/create/botellas', async (req, res) => {
    console.log('server reate botellas')
    res.json(await db.botellas.get())
  });
  
  router.post('/api/create/users', async (req, res) => {
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
router.get('/api/read/users', async (req, res) =>  {
      console.log('server read users')
      res.json(await db.users.get())
    });


  router.get('/api/read/botellas', async (req, res) => {
   
      console.log('server read botellas')
      res.json(await db.botellas.get())
    });


 // UPDATE     
 router.put('/api/update/users/:_id', async (req, res) => {
  res.json(await db.users.update(req.params._id, req.body))
  console.log('update', req.params._id, req.body)
})

// DELETE

 router.delete('/api/delete/user/', async (req, res) => {
    console.log('server delete user', req.body, typeof req.body)

    res.json(await db.users.delete(req.body._id))
      })  

 
  router.delete('/api/delete/from/cart', async (req, res) => {
    console.log('server delete from cart')
    
    res.json(await db.users.DeleteFromCart( req.body.idBotella, req.body.idUser))
   
      })

   router.delete('/api/delete/cart', async (req, res) => {
    console.log('server delete cart',req.body.userId, typeof req.body.userId)
    
    res.json(await db.users.clearCart( req.body.userId))
      })  

  router.delete('/api/delete/recipe', async (req, res) => {
    console.log('server delete recipe')

    res.json(await db.users.clearRecipe( req.body.userId))
      })  


    // FILTER

    router.post('/api/busqueda', async (req, res) => {
      console.log('estamos en busqueda', req.body)
      //recuerda añadir la projeccion para filtrar los ampos que devolvemos
         res.json(await db.botellas.search( { $text: { $search: req.body.name } },{}))
      })

    router.post('/api/busqueda/cart', async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log('Ricevuti questi ID:', ids);
    const objectIds = ids.map(id => new ObjectId(id));
    const botellas = await db.botellas.findByIds({ _id: { $in: objectIds } });
    res.json(botellas);
  } catch (error) {
    console.error('Error in express', error);
  }})

router.post('/api/busqueda/party', async (req, res) => {
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
   
         router.post('/api/push/to/cart', async (req, res) => {
      console.log('estamos para push to cart', req.body)
    
         res.json(await db.users.carting( req.body.idBotella, req.body.idUser))
      })

     router.post('/api/buscar/usuario', async (req, res) => {
        console.log('estamos en busqueda', req.body)
        //recuerda añadir la projeccion para filtrar los ampos que devolvemos
           res.json(await db.users.search(req.body))
           console.log(res.json)
        })


  router.post('/api/login', async (req, res) => {
    console.log('estamos en login', req.body)
    const user = await db.users.login({ email:req.body.email, password:req.body.password})
    res.json(user)
    
  })

  router.listen(port, async () => {
    console.log(` listening on port ${port}`);
  })
  

// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);

export const db = {
    users: {
        get: getUsers,
        login: login,
        create: createUsers,
        update: updateUsers,
        search: searchUsers,
        carting: AddIdBotellaToCart,
        delete: deleteUsers,
        DeleteFromCart: DeleteFromCart,
        clearCart: clearCart,
        clearRecipe: clearRecipe
    },
    botellas: {
        get: getBotellas,
        getInCart: getBotellaInCart,
        search: searchBotellas,
        findByIds: findBotellasByIds,
       findByNames: findBotellasByNames
    }
}

  async function getBotellas(filter, projection){
    console.log('hey from get bottellas')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();
   
  }


  async function getBotellaInCart(){
    console.log('hey from get botellas in cartMONGODB')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const usersCollection = PartytimetDB.collection('Botellas');
    return await usersCollection.findOne({  });
  }

async function AddIdBotellaToCart(idBotella, idUser){
    console.log('hey from add to cart')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const usersCollection = PartytimetDB.collection('users');
    return await usersCollection.updateOne({ _id: new ObjectId(idUser) }, { $push: { cart: idBotella } });
  }

  async function  getUsers(filter, projection){
    console.log('hey from get users')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const usersCollection = PartytimetDB.collection('users');
  return await usersCollection.find(filter).project(projection).toArray();

  }

  async function searchBotellas(filter,projection){
    console.log('hey from search botellas')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const botellasCollection = PartytimetDB.collection('Botellas');
    return await botellasCollection.find(filter).project(projection).toArray();

  }

/**
 * Searches for a user in the 'users' collection in the 'Partytime' database
 * using the provided filter.
 *
 * @param {string} filter - The filter to locate the user, typically a user ID.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, or null otherwise.
 */

  async function searchUsers(filter){
    console.log('hey from search users')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const usersCollection = PartytimetDB.collection('users');

    console.log({id: new ObjectId(filter) })
   
    let UserFromDB = await usersCollection.findOne({ _id: new ObjectId(filter) });
    console.log(UserFromDB)
    return UserFromDB
  }
  async function findBotellasByIds(filter) {
  console.log('Cercando bottiglie con questi ID:', filter);

  const client = new MongoClient(URI);
  const db = client.db('Partytime');
  const botellasCollection = db.collection('Botellas');

  return await botellasCollection.find(filter).toArray();
}
  

  async function login({email, password}){
    console.log('hey from login')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const usersCollection = PartytimetDB.collection('users');
    let collectionUsers = usersCollection.findOne({email, password})
    return await collectionUsers
  
   }

 async function createUsers(user){
    console.log('your email has been registred', user.email)
    const client = new MongoClient(URI);
    const PartytimeDB = client.db('Partytime');
    const usersCollection = PartytimeDB.collection('users');
    return await usersCollection.insertOne(user)
  }

  async function updateUsers(id, updates){
    console.log('your recipe has been saved to your account', )
    const client = new MongoClient(URI);
    const PartytimeDB = client.db('Partytime');
    const usersCollection = PartytimeDB.collection('users');
    
    const returnValue = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log(returnValue)
    return returnValue
  }
async function deleteUsers(id){
    console.log('your account has been deleted from MONGOdb', id)
    const client = new MongoClient(URI);
    const PartytimeDB = client.db('Partytime');
    const usersCollection = PartytimeDB.collection('users');
    const returnValue = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    console.log(returnValue)
    return returnValue
  }


async function DeleteFromCart(idBotella, idUser) {
  console.log('Deleting from cart...');
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(idUser) },
     { $pull: { cart: idBotella } }
    );

    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from cart:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function clearCart(userId) {
  console.log('Clearing cart...');
  const client = new MongoClient(URI);

  try {
   await client.connect();
const db = client.db('Partytime');
const users = db.collection('users');

const result = await users.updateOne(
  { _id: new ObjectId(userId) },
  { $unset: { cart: "" } }
);          

    console.log('Clear result:', result);
    return result;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  } finally {
    await client.close();
  }
}
  async function clearRecipe(userId) {
  console.log('Clearing recipe...');
  const client = new MongoClient(URI);

  try {
   await client.connect();
const db = client.db('Partytime');
const users = db.collection('users');

const result = await users.updateOne(
  { _id: new ObjectId(userId) },
   { $unset: { receta: ""} }
);          

    console.log('Clear result:', result);
    return result;
  } catch (error) {
    console.error('Error clearing recipe:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function findBotellasByNames(filter, projection){
  console.log('hey from display party in mongo DB')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();
}

