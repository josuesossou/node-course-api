const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/db/todos');
const {User}= require('./../server/db/users');

//you can use .remove({}) to delete all data in the database 
//you can use .findOneAndRemove to delete only one object in the database -- returns the deleted object
//you can use .findByIdAndRemove to delete by the id of the object -- returns the deleted object that has the id


let id = '5ab01d143d0715144c896753'

User.findByIdAndRemove(id).then(user=>{

    if(!user) return console.log('unable to find user');

    console.log(JSON.stringify(user, undefined, 2));

}).catch(e=> console.log(e))


