const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config();
require('./db/init_mongodb')
const AuthRoute = require('./routes/auth.route')
const {VerifyAccessToken} = require('./authProvider/jwt.provider')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', VerifyAccessToken, async(req,res, next)=>{
     
    res.send("hello express");
})

app.use('/auth', AuthRoute)

app.use(async (req, res, next)=>{
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})