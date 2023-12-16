// const { MongoClient } = require('mongodb');
const config = require('./config.js');
const mongoose = require ('mongoose');

console.log('config: ',config);

// eslint-disable-next-line no-unused-vars
const dbUrl = config.dbUrl;
//const client = new MongoClient(dbUrl);

(async ()=> {
  // TODO: Database Connection
  try {
    //await client.connect();
    console.log('Conected');
    //const db = client.db('burger-queen-api'); // Reemplaza <NOMBRE_DB> por el nombre del db
    const db = await mongoose.connect(dbUrl)
    console.log('-----db.connect.name: ',db.connection.name);
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
})();

// connect().then(res => (console.log('conected to db')))
//module.exports = { connect };
