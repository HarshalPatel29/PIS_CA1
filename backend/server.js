const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`PasX app listening on port http://localhost:${port}`)
})