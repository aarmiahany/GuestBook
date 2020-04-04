let User = require("../../schema/users");
let tokenData = require("../../tokens/token");

var userHandler = {};

// handler for user create user
userHandler._createUser = (data, callback) => {
     // get payload from data obj
     const { username, email, password, phone } = data.payload;
     // check if data exits
     if(!username || !email || !password || !phone){
         return callback(null, 400, '{ msg : Bad Request }');
     }

    let payload = data.payload;

    // handle if user exits
    User.findOne({ email })
    .then(u => {
        // if user already Exists
        if(u){
           return callback(null, 400, '{msg: User Already Exists}');
        }
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
    })
  
}

// handler for user login
userHandler._loginUser = (data, callback) => {
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