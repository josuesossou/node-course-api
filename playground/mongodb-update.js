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

    // db.collection('Users').findOneAndUpdate(
    //     {_id:new ObjectId('5aaeaa228bca6d2dc42ff66c')},
    // {
    //     $set: {completed:true}
    // }).then(res=>{
    //     console.log(res)
    // }, {returnOriginal:false})

    db.collection('Users').findOneAndUpdate(
        {name:"josue"},
    {
        $inc: {age: 2}
    }, {returnOriginal:false}).then(res=>{
        console.log(res)
    })

    // client.close();
})