const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        require:true,
        minlength:1,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:6,
        require:true
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    
    return _.pick(userObject, ["_id", "email"])
}

UserSchema.methods.generateAuthToken = function () {

    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id, access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });

}

UserSchema.statics.findByToken = function (token) {
    
    let User = this;
    let decode;

    try {
        decode = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject('error from model')
    }

    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access':'auth'
    })
    

}

const User = mongoose.model('User', UserSchema);

//normal syntax
// module.exports.User = User;

// //ES6 syntax
module.exports = {User};