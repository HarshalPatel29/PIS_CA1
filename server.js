const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express()
const port = 3000

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
// Database Name
const dbName = 'passpax';

async function connectToMongoDB() {
  try {
      await client.connect();
      console.log("Connected successfully to MongoDB");
  } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1);
  }
}

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
app.post('/passwords', async (req, res)=>{
  try{
    const {website, username, password, comment} = res.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    // removes exiting entry for the website
    await collection.deleteOne({website});

    // insert new password
    const result = await collection.insertOne({ website, username, password, comment })
    res.json({success: true, result});
  }catch(error){
    res.status(500).json({success: false, error: error.message});
  }
})

// delete a password
app.delete('/passwords', async (req,res)=>{
  const { website } = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  
  const result = await collection.deleteOne({ website });
  
  res.json({ success: true, result });
})

connectToMongoDB().then(()=>{
app.listen(port, () => {
  console.log(`PasX app listening on port http://localhost:${port}`)
});
});