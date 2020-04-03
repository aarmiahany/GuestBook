let Reply = require("../../schema/reply");
let Message = require("../../schema/message");
let auth = require("../../helpers/auth");

let replayHandler = {};

replayHandler._reply = function(data, callback) {
    let methods = ['post'];
    if(methods.indexOf(data.method) > -1 ){
        replayHandler._reply[data.method](data, callback);
    }
}

replayHandler._reply.post = function(data, callback){

     // check is token is valid by auth helper function
     authHelper(data, callback);
     
    // get payload from data obj
    const { content , author, id } = data.payload;
    // check if data exits
    if(!id){ 
        return callback(null, 400, "{msg: message id required}");
    }
    if(!content || !author){
      return callback(null, 400, '{ msg : Bad Request }');
     }

    let payload = data.payload;
    let reply = new Reply();
    reply.content = payload.content;
    reply.author = author;

    reply.save()
    .then(reply => {
        return Message.findByIdAndUpdate({ _id : payload.id }, {replies: reply._id}, {new: true})
    })
    .then(msg => {
        return callback(null, 200, JSON.stringify(msg));
    })
    .catch(ex => {
        callback(ex);
    })
}

module.exports = replayHandler;