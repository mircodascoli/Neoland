import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
    users: {
        count: countUsers,
        get: getUsers,
        login: login,
        create: createUsers,
        update: updateUsers,
        search: searchUsers,
        carting: AddIdBotellaToCart,
    },
    botellas: {
        get: getBotellas,
        getInCart: getBotellaInCart,
        search: searchBotellas,
       
    }
}
async function countUsers() {
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const usersCollection = PartytimetDB.collection('users');
    return await usersCollection.countDocuments()
  }

  async function getBotellas(filter, projection){
    console.log('hey from get bottellas')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();
   
  }


  async function getBotellaInCart(){
    console.log('hey from get botellas in cart')
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