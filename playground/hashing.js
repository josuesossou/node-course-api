const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var message = "I love eating ducks";
var hash = SHA256(message);

var hashjwt = jwt.sign(message, 'secret');
console.log('Hash JWT',hashjwt);

var verifyjwt = jwt.verify(hashjwt +2, 'secret')
console.log(verifyjwt)

console.log(message);
console.log(hash.toString());

var data = {
    id: 5
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'myScretMessage').toString()
}

token.data.id = 10;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var veryfiedResult = SHA256(JSON.stringify(data) + 'myScretMessage').toString();

if(token.hash === veryfiedResult){
    console.log('safe');
} else {
    console.log('Hackers');
}