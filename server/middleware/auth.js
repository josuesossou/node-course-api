const {User} = require('./../db/users');

var authenticate = (req, res, next)=>{

    let token = req.header('x-auth');

    User.findByToken(token).then(user =>{
        if(!user) return Promise.reject('error from server');
        
        req.user = user;
        req.token = token;
        next();
    }).catch(e => res.status(401).send())

}
module.exports = {authenticate};