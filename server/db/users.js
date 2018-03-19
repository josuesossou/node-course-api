const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email:{
        type:String,
        trim:true,
        require:true,
        minlength:1
    }
});

//normal syntax
// module.exports.User = User;

// //ES6 syntax
module.exports = {User};