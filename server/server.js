const express = require('express');
const bodyParser = require('body-parser');

//normal syntax
// const mongoose = require('./db/mongoose').mongoose;
// const Todo = require('./db/todos').Todo;
// const User = require('./db/users').User;

//ES6 destructuring syntax
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./db/todos');
const {User}= require('./db/users');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{

    let todo = new Todo({
        text: req.body.text,
    })

    todo.save().then(doc=>{
        res.send(doc);
    }, err=>{
        res.status(400).send(err)
    })

});

app.get('/todos', (req, res)=>{
    Todo.find().then(todos=>{
        res.send({todos});
    }).catch(e => res.send(e));
});

app.listen(3000, ()=>{
    console.log('server start on port 3000');
});

module.exports = {app};