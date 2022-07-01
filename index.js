const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = 5000;
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mymongodb1:zvtQKk7M4ipeVfeC@cluster0.yq19m.mongodb.net/?retryWrites=true&w=majority";;
// url to connect to mongodb
const client = new MongoClient(uri);
// client to connect to mongodb

const run = async () => {
    try {
        await client.connect();
        // connect to mongodb
        console.log('Connected to MongoDB');
        const database = client.db("poducts");
        // database to store products
        const product = database.collection("product");
        // collection to store products
        app.post('/products', async (req, res) => {
            // console.log("hitting post route");
            console.log(req.body);
            const newProducts = req.body;
            const result = await product.insertOne(newProducts);
            console.log("inserted id : ", result.insertedId);
            res.json(result);
        });
        // add products to mongodb
        app.get('/products', async (req, res) => {
            console.log("get products");
            const result = await product.find({}).toArray();
            res.json(result);
        })
        app.get('/products/:id', async (req, res) => {
            console.log("get product by id", req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await product.findOne(query);
            console.log("result: ", result);
            res.json(result);
        }
        )
        // get products from mongodb

        app.delete('/products/:id', async (req, res) => {
            console.log("delete products");
            const id = req.params.id;
            const result = await product.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })
        // delete products from mongodb

        app.put('/products/:id', async (req, res) => {
            console.log("update products", req.params.id, req.body);
            const id = req.params.id;
            const updatedContents = req.body;
            const update = {
                $set: {
                    name: updatedContents.name,
                    price: updatedContents.price,
                    description: updatedContents.description
                }
            };
            console.log("set update: ", update);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const result = await product.updateOne(query, update, options);
            res.send(result);
        })

    } catch (err) {
        await client.close();
    }
}
run().catch(console.error);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

