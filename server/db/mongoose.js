const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TotoApp');

// //normal syntax
// module.exports.mongoose = mongoose;

//ES6 syntax
module.exports = {mongoose};