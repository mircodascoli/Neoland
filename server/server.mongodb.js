import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
    users: {
        count: countUsers,
        get: getUsers,
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
