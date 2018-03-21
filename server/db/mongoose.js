const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

//normal syntax
// module.exports.mongoose = mongoose;

//ES6 syntax
module.exports = {mongoose};