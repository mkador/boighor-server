const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1g0ejju.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const usersCollection = client.db('boighorDb').collection('users')
    const categoriesCollection = client
      .db('boighorDb')
      .collection('product_category')
    const productCollection = client.db('boighorDb').collection('product')
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const filter = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log(result)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
      })
      console.log(token)
      res.send({ result, token })
    })
    console.log('Database Connected...')

    app.get('/categories', async (req, res) => {
      const query = {}
      const categories = await categoriesCollection.find(query).toArray()
      res.send(categories)
    })

    app.get('/category/:id', async (req, res) => {
      const id = req.params.id

      const category_products = await productCollection
        .find({ category_id: id })
        .toArray()
      res.send(category_products)
    })

    app.post('/addProduct', async (req, res) => {
      const product = req.body

      const result = await productCollection.insertOne(product)
      res.send(result)
    })
  } finally {
  }
}
run().catch((error) => console.error(error))

app.get('/', (req, res) => {
  res.send('BoiGhor server is Running')
})

app.listen(port, () => {
  console.log(`BoiGhor server is running on ${port}`)
})
