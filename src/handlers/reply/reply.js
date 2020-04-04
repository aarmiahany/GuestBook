let Reply = require("../../schema/reply");
let Message = require("../../schema/message");
let authHelper = require("../../helpers/auth");

let replayHandler = {};

replayHandler._reply = function(data, callback){

     // check is token is valid by auth helper function
     authHelper(data, callback);
     
    // get payload from data obj
    const { content , id } = data.payload;
    // check if data exits
    if(!id){ 
        return callback(null, 400, "{msg: message id required}");
    }
    if(!content){
      return callback(null, 400, '{ msg : Bad Request }');
     }

    let payload = data.payload;
    let reply = new Reply();
    reply.content = payload.content;

    reply.save()
    .then(reply => {
        return Message.findByIdAndUpdate({ _id : payload.id }, {$push: {replies: reply._id}}, {new: true})
    })
    .then(msg => {
        return callback(null, 200, JSON.stringify(msg));
    })
    .catch(ex => {
        callback(ex);
    })
}

module.exports = replayHandler;