const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TotoApp');

// //normal syntax
// module.exports.mongoose = mongoose;

//ES6 syntax
module.exports = {mongoose};