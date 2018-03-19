const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text:{
        type:String,
        minlength:1,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    completedAt:{
        type:Number,
        default:null,
    }
});

// //normal syntax
// module.exports.Todo = Todo;

//ES6 syntax
module.exports = {Todo};