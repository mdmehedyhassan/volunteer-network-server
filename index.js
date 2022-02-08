const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId  = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer_network");
    const volunteerCollections = database.collection("volunteer");
    const eventsCollections = database.collection("events");

    // get api
    app.get('/volunteer', async (req, res) => {
      const getDonation = volunteerCollections.find({});
      const donationToArray =await getDonation.toArray();
      res.json(donationToArray);
    })
    app.get('/allEvent', async (req, res) => {
      const getDonation = eventsCollections.find({});
      const donationToArray =await getDonation.toArray();
      res.json(donationToArray);
    })

    // get one
    app.get('/volunteerRegister/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const existVolunteer = await eventsCollections.findOne(query);
      console.log(existVolunteer)
      res.json(existVolunteer);
    })

    // post api
    app.post('/volunteerRegister', async (req, res) => {
      const getNewRegister = req.body;
      const result = await volunteerCollections.insertOne(getNewRegister);
      res.send(result);
    })
    app.post('/events', async (req, res) => {
      const getNewRegister = req.body;
      const result = await eventsCollections.insertOne(getNewRegister);
      res.send(result);
    });

    // delete api 
    app.delete('/volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await volunteerCollections.deleteOne(query);
      res.send(result);
    })
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})