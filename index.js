const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionsSuccessStatus: 200
}

// middlewares
app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebwzlrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})