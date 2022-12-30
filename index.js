const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2elctou.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const taskCollection = client.db('dailyTask').collection('task')
        const addtasksCollection = client.db('dailyTask').collection('addtasks')
        

        app.get('/mytask', async(req, res) => {
          const query = {};
          const mytask = await taskCollection.find(query).toArray();
          res.send(mytask)
        })

        // task added in databse
        app.post('/tasks', async(req, res) => {
            const dailyTask = req.body;
            console.log(dailyTask)
            const result = await taskCollection.insertOne(dailyTask);
            res.send(result)
        })

        // add task
        app.post('/addtasks', async(req, res) => {
          const addtask = req.body;
          const result = await addtasksCollection.insertOne(addtask);
          res.send(result)
        })

        // delete my task
        app.delete('/mytask/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await taskCollection.deleteOne(query);
          res.send(result)
      })
    }
    finally{

    }
    
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Daily Task')
})

app.listen(port, () => {
  console.log(`Daily task on port ${port}`)
})