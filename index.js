const express = require('express')
const cors = require('cors')
// const jwt = require('jsonwebtoken')
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
  } finally {
  }
}
run().catch((errpr) => console.error(error))

app.get('/', (req, res) => {
  res.send('BoiGhor server is Running')
})

app.listen(port, () => {
  console.log(`BoiGhor server is running on ${port}`)
})
