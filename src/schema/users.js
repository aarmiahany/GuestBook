let mongoose = require("mongoose");
let crypto = require("crypto");

// drawing user Model
let userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength: 4},
    email : { type: String, required: true},
    password : { type: String, required: true},
    salt: {type: String}, // for password encryption
    phone : { type: Number, required: true, min: 11},
    createdAt: { type: Date , required: true},
});

// hash user password before saving it
userSchema.methods.hashUserPassword = function(password){
    // gen salt
    this.salt = crypto.randomBytes(16).toString('hex'); 
    //hash user password 
    this.password = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}

userSchema.methods.isValidPassword = function(password){
        // check if password matches after encryption
        var hash = crypto.pbkdf2Sync(password,  
        this.salt, 1000, 64, `sha512`).toString(`hex`); 
        return this.password === hash; 

}

module.exports = mongoose.model('User', userSchema);