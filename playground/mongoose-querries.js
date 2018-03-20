const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/db/todos');
const {User}= require('./../server/db/users');

//you can use .find() to querry all object in the database -- returns an array of objects
//you can use .findOne to querry only one object in the database -- returns an object
//you can use .findById to querry by the id of the object -- returns the object that has the id (this one is specific to id property, in case the id null or undefined this one will not work)


// let user = new User({
//     email: 'josuesossou8@gmail.com',
// })

// user.save().then(doc=>{
//     console.log(doc);
// }, err=>{
//     console.log(err)

let id = '5ab01d143d0715144c896753'

User.findById(id).then(user=>{

    if(!user) return console.log('unable to find user');

    console.log(JSON.stringify(user, undefined, 2));

}).catch(e=> console.log(e))


