let mongoose = require('mongoose');
let config = require("../config/config");

module.exports =  function dbConnection () {
    mongoose.connect(config.MongoURL, {useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log("connected successfully")
    });

}