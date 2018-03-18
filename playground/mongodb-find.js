// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId}= require('mongodb');

// var randomId = new ObjectId()
// console.log(randomId.getTimestamp());
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{

    const db = client.db('TodoApp');
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connect to MongoDb server');
    
    db.collection('Users').find({location:"PG county"}).toArray().then((docs)=>{
        console.log(docs)
    });

    db.collection('Users').find({
        _id: new ObjectId('5aaea8506940421b049e06ec')
    }).toArray().then((docs)=>{
        console.log(docs)
    });

    db.collection('Users').find().count().then((count)=>{
        console.log(`total of ${count}`)
    });

    // client.close();
})