const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../db/todos');
const {User} = require('./../../db/users');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [
    {
        email: "test@email.com",
        _id: userOneId,
        password: "userOnePass",
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id:userOneId, access:'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        email: "test2@email.com",
        _id: userTwoId,
        password: "userTwoPass",
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id:userTwoId, access:'auth'}, process.env.JWT_SECRET).toString()
        }]
    }
];

const todos = [
    {
        text: "first todo",
        _id: new ObjectId(),
        _creator:userOneId
    },
    {
        text: "second todo",
        _id: new ObjectId(),
        completed:true,
        completedAt:333,
        _creator:userTwoId
    }
];

const populateTodos = (done) => {

    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done())
   
};

const populateUsers = (done) => {

    User.remove({}).then(()=> {
       var firstUser =  new User(users[0]).save();
       var secondUser = new User(users[1]).save();

       return Promise.all([firstUser, secondUser]);
    }).then(()=>done())
   
};

module.exports = {todos, populateTodos, users, populateUsers};