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
    //DeleteMany
    // db.collection('Users').deleteMany({location:'PG county'}).then(res=>{
    //     console.log(res)
    // })

    //DeleteOne
    // db.collection('Users').deleteOne({_id: new ObjectId('5aaea8506940421b049e06ec')}).then(res=>{
    //     console.log(res)
    // })

    //FindOneandDelete
    db.collection('Users').findOneAndDelete({location:'my Place'}).then(res=>{
        console.log(res)
    })

    // client.close();
})