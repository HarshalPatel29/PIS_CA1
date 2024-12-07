const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const dotenv = require('dotenv');
dotenv.config();

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';

const port = 3000

// index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(port, () => {
  console.log(`PasX app listening on port http://localhost:${port}`)
})