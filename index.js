const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://swapsavvy-4bd63.web.app'],
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
        const queriesCollection = client.db("swap_savvy_database").collection("queries")
        const recommendationsCollection = client.db("swap_savvy_database").collection("recommendations")

        //get all queries data
        app.get('/queries', async (req, res) => {
            const cursor = queriesCollection.find({})
            const queries = await cursor.toArray()
            res.send(queries)
        })

        //get all queries data by time posted
        // app.get('/queries_by_time', async (req, res) => {
        //     const cursor = queriesCollection.find({}).sort({ createdAt: -1 });
        //     const queries = await cursor.toArray();
        //     res.send(queries);
        // })

        //get query by id
        app.get('/query_details/:id', async (req, res) => {
            const id = req.params.id
            const query = await queriesCollection.findOne({ _id: new ObjectId(id) })
            res.send(query)
        })

        //get all queries by user email
        app.get('/queries/:email', async (req, res) => {
            const email = req.params.email
            const cursor = queriesCollection.find({ user_email: email })
            const queries = await cursor.toArray()
            res.send(queries)
        })

        // save query
        app.post('/queries', async (req, res) => {
            const query = req.body
            const result = await queriesCollection.insertOne(query)
            res.send(result)
        })

        // update query
        app.put('/queries/:id', async (req, res) => {
            const id = req.params.id
            const updatedQuery = req.body
            const result = await queriesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedQuery })
            res.send(result)
        })

        // delete query
        app.delete('/queries/:id', async (req, res) => {
            const id = req.params.id
            const result = await queriesCollection.deleteOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        // get all recommendations
        app.get('/recommendations', async (req, res) => {
            const cursor = recommendationsCollection.find({})
            const recommendations = await cursor.toArray()
            res.send(recommendations)
        })

        // get all recommendations by user email
        app.get('/recommendations/:email', async (req, res) => {
            const email = req.params.email
            // const cursor = recommendationsCollection.find({ user_email: {$ne: email} })
            const cursor = recommendationsCollection.find({ user_email: email })
            const recommendations = await cursor.toArray()
            res.send(recommendations)
        })

        // get all recommendations by user email except the users post
        app.get('/recommendations_forme/:email', async (req, res) => {
            const email = req.params.email
            const cursor = recommendationsCollection.find({ user_email: { $ne: email } })
            const recommendations = await cursor.toArray()
            res.send(recommendations)
        })

        // get all recommendations by query id
        app.get('/recommendations/id/:id', async (req, res) => {
            const id = req.params.id
            const cursor = recommendationsCollection.find({ old_id: id })
            const recommendations = await cursor.toArray()
            res.send(recommendations)
        })

        // save recommendation
        app.post('/recommendations', async (req, res) => {
            const recommendation = req.body
            const result = await recommendationsCollection.insertOne(recommendation)
            res.send(result)
        })

        // delete recommendation by id
        app.delete('/recommendations/:id', async (req, res) => {
            const id = req.params.id
            const result = await recommendationsCollection.deleteOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        // increment recommendation count by 1
        app.put('/queries/:id/recommend', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = { $inc: { recommendation_count: 1 } };

            const result = await queriesCollection.updateOne(query, update);

            if (result.modifiedCount === 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })

        // await client.db("admin").command({ ping: 1 });
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