// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId}= require('mongodb');

var randomId = new ObjectId()
console.log(randomId.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{

    const db = client.db('TodoApp');
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connect to MongoDb server');

    // db.collection('Todos').insertOne({
    //     text:'Something',
    //     completed:false
    // }, (err, res) => {
    //     if(err){
    //         return console.log('Unable to insert Todos', err);
    //     }
    //    console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name:'Josue',
    //     age:23,
    //     location:'PG county'
    // }, (err, res) => {
    //     if(err){
    //         return console.log('Unable to insert Todos', err);
    //     }
    //    console.log(JSON.stringify(res.ops, undefined, 2));
    //    console.log(res.ops[0]._id.getTimestamp())
    // });

    
    client.close();
})