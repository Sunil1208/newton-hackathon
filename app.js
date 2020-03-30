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

app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

//Read all the birthday stored
app.get('/getBirthday',(req,res)=>{
    database.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    })
});

app.put('/:id', (req, res) => {

    const birthdayID = req.params.id;

    const _name = req.body.userName;
    const _date = req.body.date;

    database.getDB().collection(collection).findOneAndUpdate({
        _id: database.getPrimaryKey(birthdayID)
    }, {
        $set: {
            userName: _name.userName,
            date : _date.date
        }
    }, {
        returnOriginal: false
    }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

app.post('/',(req, res, next)=>{
    const userInput = req.body;
    Joi.validate(userInput,schema,(err, result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }else{
            database.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Record");
                    error.status = 400;
                    next(error);
                }else{
                    res.json({
                        result: result,
                        document: result.ops[0],
                        msg:"Record added successfully!!",
                        msg1: "Record deleted successfully",
                        error: null
                    });
                }
            });
        }
    })
});


app.delete('/:id', (req, res) => {
    const birthdayID = req.params.id;
    database.getDB().collection(collection).findOneAndDelete({
        _id: database.getPrimaryKey(birthdayID)
    }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    });
});


app.use((err, req, res, next) => {
    res.status(err.status).json({
        error: {
            message: err.message
        }
    });
})

database.connect((err)=>{
    if(err){
        console.log('Unable to establish connection with the database');
        process.exit(1);
    }else{
        app.listen(port,()=>{
            console.log('Connection established with the database, server running at port '+port);
        });
    }
});

// app.listen(port,()=>{
//     console.log('Server established at port '+port);
// })