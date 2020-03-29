const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const Joi = require('joi')
const database = require("./database")
const collection = "birthDay"

const app = express()

var port = process.env.PORT || 5000

const schema = Joi.object().keys({
    userName: Joi.string().required(),
    date:Joi.date().required()
});

app.use(bodyParser.json());



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

app.listen(port,()=>{
    console.log('Server established at port '+port);
})