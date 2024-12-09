const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectToMongoDB() {
  try {
      await client.connect();
      console.log("Connected successfully to MongoDB");
  } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1);
  }
}

// Database Name
const dbName = 'passpax';

const app = express()
const port = 3000

// index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// get all the passwords
app.get('/passwords', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// save a passwords
app.post('/', async (req, res)=>{
    const {website, username, password, comment} = res.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    // removes exiting entry for the website
    await collection.deleteOne({website});
    const findResult = await collection.insertOne(password)
    res.send({ success : true, result: findResult})
})

app.listen(port, () => {
  console.log(`PasX app listening on port http://localhost:${port}`)
})