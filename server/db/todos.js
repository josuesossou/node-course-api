const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text:{
        type:String,
        minlength:1,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false,
    },
    completedAt:{
        type:Number,
        default:null,
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

// //normal syntax
// module.exports.Todo = Todo;

//ES6 syntax
module.exports = {Todo};