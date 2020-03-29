const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')


const app = express()

var port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send('Hello world');
})

app.listen(port,()=>{
    console.log('Server established at port '+port);
})