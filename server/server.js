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

app.post('/todo', (req, res)=>{

    let todo = new Todo({
        text: req.body.text,
    })

    todo.save().then(result=>{
        res.send(todo);
    }, err=>{
        res.status(400).send(err)
    })

})

app.listen(3000, ()=>{
    console.log('server start on port 3000');
});