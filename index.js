const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 9988
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://ashaduzzamansojib67:ZjMlKPajdMvFp31l@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority";

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
        const stManageDB = client.db('sujon-telecom').collection('PackagesList');
        const payment = client.db('sujon-telecom').collection('payItem');
        const customerLists = client.db('sujon-telecom').collection('customers');

        // customers api
        app.get('/customer-list', async (req, res) => {
            const query = await customerLists.find().toArray();
            res.send(query)
        });
        app.post('/create-customer', async (req, res) => {
            const query = req.body;
            query.createdAt = new Date;
            const result = await customerLists.insertOne(query)
            res.send(result)
        });
        app.get('/single-customer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const findItem = await customerLists.findOne(query);
            res.send(findItem)
        });
        app.delete('/remove-customer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await customerLists.deleteOne(query);
            res.send(result)
        });
        app.put('/add-existing-item', async (req, res) => {
            const body = req.body;
            body.createdAt = new Date();
            const customerId = body.customerID;
            const query = { _id: new ObjectId(customerId) };
            const updateItem = { $push: { stock: body } };
            const result = await customerLists.updateOne(query, updateItem);
            res.send(result)
        });

        // old st management routes
        app.get('/packages', async (req, res) => {
            const result = await stManageDB.find().toArray();
            res.send(result)
        });
        app.post('/packages', async (req, res) => {
            const query = req.body;
            const result = await stManageDB.insertOne(query);
            res.send(result)
        });
        app.delete('/delete-combo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await stManageDB.deleteOne(query)
            res.send(result)
        })
        app.get('/payment', async (req, res) => {
            const query = await payment.find().toArray();
            res.send(query)
        })
        app.post('/payment', async (req, res) => {
            const query = req.body;
            console.log(query)
            const result = await payment.insertOne(query);
            res.send(result)
        })
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


app.get('/', async (req, res) => {
    res.send("The server is running..")
});
app.listen(port, async (req, res) => {
    console.log(port, "the server running")
});