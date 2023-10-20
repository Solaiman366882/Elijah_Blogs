const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();


//Middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ea4znei.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const database = client.db("brandDB");
    const productCollection = database.collection("product");

    //add single product to database
    app.post('/product', async(req,res) => {

        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result)
    })

    //get all products
    app.get('/products', async(req,res) => {

        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    //get single product by id
    app.get('/product/:id', async(req,res) => {

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    });

    //Update a single Product
    app.put('/product/update/:id', async(req,res) => {
        const id =  req.params.id;
        const filter = {_id : new ObjectId(id)};
        const options = { upsert: true };
        const productInfo = req.body;
        const updatedProduct = {
            $set:{
                name:productInfo.name,
                type:productInfo.type,
                price:productInfo.price,
                rating:productInfo.rating,
                photo:productInfo.photo,
                brand:productInfo.brand,
                shortDescription:productInfo.shortDescription
            }
        }
        const result = await productCollection.updateOne(filter,updatedProduct,options);
        res.send(result);

    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







//server initialize
app.get('/', (req,res) => {
    res.send('Coffee Server is Running')
});

app.listen(port, (req,res) => {
    console.log(`The server is running on port: ${port}`);
})