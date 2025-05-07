import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
    users: {
        count: countUsers,
        get: getUsers,
        login: login,
        create: createUsers,
        update: updateUsers
    },
    botellas: {
        get: getBotellas,
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

  async function  getUsers(filter, projection){
    console.log('hey from get users')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('users');
  return await botellasCollection.find(filter).project(projection).toArray();

  }

  async function searchBotellas(filter,projection){
    console.log('hey from search botellas')
    const client = new MongoClient(URI);
    const PartytimetDB = client.db('Partytime');
    const botellasCollection = PartytimetDB.collection('Botellas');
    return await botellasCollection.find(filter).project(projection).toArray();

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