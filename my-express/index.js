const { MongoClient } = require("mongodb");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

async function run() {
  let obj;
  try {
    obj = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await obj.connect();
    console.log("Connected to MongoDB");
    const db = obj.db("StudentDB");
    const collection = db.collection("students");
    console.log("Got collection object");

    app.post('/submit-form', async (req, res) => {
      const formData = req.body;
      console.log(formData);
      try {
        const insertOneres = await collection.insertOne(formData);
        console.log(`${insertOneres.insertedCount} documents successfully inserted`);
        res.json({ message: "Form Successfully Submitted!" });
      } catch (e) {
        console.log("Error Occurred by Sura:", e.message);
      }
    });

    app.listen(port, () => {
      console.log(`Express Listening on ${port}`);
    });
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message);
  } finally {
    if (obj) {
      // await obj.close();
    }
  }
}

run().catch(console.dir);
