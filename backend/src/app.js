const express = require('express')
const cors = require('cors')
const aiRoutes = require('./routes/ai.routes')

const app = express()
app.use(express.json())

app.use(cors());


app.get('/', (req , res)=>{
  res.send('fineeeeee')
})

app.use('/ai', aiRoutes)

module.exports = app