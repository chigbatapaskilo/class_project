require('dotenv').config()
require('./config/db')
const userRouter = require('./router/userRouter')
const studentRouter = require('./router/studentRouter')

const express = require('express')

const app = express()

app.use(express.json())

app.use('/api/v1', userRouter)
app.use('/api/v1', studentRouter)

const PORT = process.env.PORT||1999

app.listen(PORT, ()=>{
    console.log(`server is listening to PORT: ${PORT}`)
})