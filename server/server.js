require('./config/config');

const {ObjectId} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

//normal syntax
// const mongoose = require('./db/mongoose').mongoose;
// const Todo = require('./db/todos').Todo;
// const User = require('./db/users').User;

//ES6 destructuring syntax
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./db/todos');
const {User}= require('./db/users');
const {authenticate} = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{

    let todo = new Todo({
        text: req.body.text,
        _creator:req.user._id
    });

    todo.save().then(doc=>{
        res.send(doc);
    }, err=>{
        res.status(400).send(err)
    });

});

app.get('/todos', authenticate, (req, res)=>{
    Todo.find({_creator:req.user._id}).then(todos=>{
        res.send({todos});
    }).catch(e => res.send(e));
});

app.get('/todos/:id', authenticate, (req, res)=>{

    let id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(400).send(`Bad id ${id}`);
    } 

    Todo.findOne({_id:id, _creator:req.user._id}).then((todo)=>{

        if (!todo) {
            return res.status(404).send("Todo does not exist on this id");  
        };

        res.send({todo});

    }).catch(e=>res.status(400).send('bad id'));

});

app.delete('/todos/:id', authenticate, (req, res)=>{

    let id = req.params.id;

    if(!ObjectId.isValid(id)) return res.status(400).send(`bad request: ${id} not valid`);

    Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo)=>{
        if(!todo)return res.status(404).send("Unable to delete");
        res.send({todo});
    }).catch(e=>res.status(400).send(e));

});

app.patch('/todos/:id', authenticate, (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ["text", "completed"]);
    
    if(!ObjectId.isValid(id)) return res.status(400).send(`bad request: ${id} not valid`);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new:true}).then(todo=>{

        if (!todo) return res.status(404).send('Unable to update');

        res.send({todo});
        
    }).catch(e => res.status(400).send());

});


////Users
app.post('/users',(req, res)=>{

    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    if(!req.body.email || !req.body.password) return res.status(404).send("provide email and password");

    user.save().then(() => {

        return user.generateAuthToken();

    }).then(token => {

        res.header('x-auth', token).send(user);

    }).catch(e => res.status(400).send(e));
    
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});

app.post('/users/login', (req, res)=>{

    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredential(body.email, body.password).then(user=>{
        return user.generateAuthToken().then(token =>{
            res.header('x-auth', token).send(user);
        });
    }).catch(err=> res.status(400).send(err));

});

app.delete('/users/me/token', authenticate, (req, res)=>{

    let token = req.token;

    req.user.removeToken(token).then(()=>{
        res.status(200).send()
    }).catch(e=>{
        res.status(400).send()
    });

})

app.listen(port, ()=>{
    console.log(`server start on port ${port}`);
});

module.exports = {app};