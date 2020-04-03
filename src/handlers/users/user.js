let User = require("../../schema/users");
let tokenData = require("../../tokens/token");

var userHandler = {};

userHandler._users =  (data, callback) => {
    let methods = ['post'];
    if(methods.indexOf(data.method) > -1){
         userHandler._users[data.method](data, callback);
    }else{
        callback(null, "There is no handler for these route");
    }
}

// handler for user create user
userHandler._users.post = (data, callback) => {
     // get payload from data obj
     const { username, email, password, phone } = data.payload;
     // check if data exits
     if(!username || !email || !password || !phone){
         return callback(null, 400, '{ msg : Bad Request }');
     }

    let payload = data.payload;

    // create new User
    let user = new User();
    user.username = payload.username;
    user.email = payload.email;
    user.phone = payload.phone;
    user.createdAt = Date.now();
    user.hashUserPassword(payload.password);

    // save user in collection
    user.save()
    .then(user => {
        callback(null, 200, JSON.stringify(user))
    })
    .catch(ex => {
        callback(ex);
    })
}

userHandler._loginUser = (data, callback) => {
    let methods = ['post'];
    if(methods.indexOf(data.method) > -1){
         userHandler._loginUser[data.method](data, callback);
    }else{
        callback(null, "There is no handler for these route");
    }
}

// handler for user login
userHandler._loginUser.post = (data, callback) => {
        // get payload from data obj
        const { email, password } = data.payload;
        // check if data exits
        if(!email || !password){
            return callback(null, 400, '{ msg : Bad Request }');
        }
       let payload = data.payload;

       // check if user exists
       User.findOne({ email: payload.email })
       .then(user => {
            if(!user){ 
                return callback(null, 404, 'User Not Found');
            }
            if(user && user.isValidPassword(payload.password)){
                callback(null, 200 , JSON.stringify({user, token : tokenData.__genToken__(user.email)}));
            }else{
                callback(null, 400, 'Wrong Password');
            }
       })
       .catch(ex => {
           callback(ex);
       })
   
} 

module.exports = userHandler;