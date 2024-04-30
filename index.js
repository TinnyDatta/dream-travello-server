const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlyr1jn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const touristsSpotsCollection = client.db('touristsSpotsDB').collection('touristsSpot');
    const countriesCollection = client.db('countriesDB').collection('countries');


    

    app.get('/addTouristsSpots', async(req, res) => {
      const cursor = touristsSpotsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/singleTouristsSpot/:id', async(req, res) => {
      const result = await touristsSpotsCollection.findOne({_id:new ObjectId(req.params.id)})
      res.send(result)
    })

    app.get('/myList/:userEmail', async(req,res)=>{
      console.log(req.params.userEmail)
      const result = await touristsSpotsCollection.find({userEmail: req.params.userEmail}).toArray();
      res.send(result)
    })
  

    app.get('/addTouristsSpots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId (id)}
      const result = await touristsSpotsCollection.findOne(query);
      res.send(result);
    })

    app.post('/addTouristsSpots', async(req, res) => {
      const addedSpot = req.body;
      console.log(addedSpot);
      const result = await touristsSpotsCollection.insertOne(addedSpot);
      res.send(result);
    })

    app.put('/addTouristsSpots/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updatedSpot = req.body;
      const spot = {
        $set: {
          country: updatedSpot.country, 
          touristsSpot: updatedSpot.touristsSpot, 
          location: updatedSpot.location, 
          seasonality: updatedSpot.seasonality, 
          averageCost: updatedSpot.averageCost, 
          travelTime: updatedSpot.travelTime, 
          image: updatedSpot.image, 
          totalVisitorPerYear: updatedSpot.totalVisitorPerYear, description: updatedSpot.description
        }
      }
      const result = await touristsSpotsCollection.updateOne(filter, spot, options)
      res.send(result);
    })

    app.delete('/addTouristsSpots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotsCollection.deleteOne(query);
      res.send(result);
    })
     
  // ****** countries

    app.get('/countries', async(req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('DreamTravello serverr is running')
})

app.listen(port, () => {
    console.log(`DreamTravello server is running on port : ${port}`)
})