const { MongoClient } = require('mongodb');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
// const { dbUrl } = config.dbUrl;
const client = new MongoClient('mongodb://127.0.0.1:27017/test');

async function connect() {
  // TODO: Database Connection
  try {
    await client.connect();
    console.log('Conected');
    const db = client.db('test'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log(db);
    return db;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// connect().then(res => (console.log('conected to db')))
module.exports = { connect };
