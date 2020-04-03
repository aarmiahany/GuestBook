let Message = require("../../schema/message");
let authHelper = require("../../helpers/auth");

var messagehandler = {};

messagehandler._msg = function(data, callback) {
    let methods = ['post', 'delete', 'put', 'get'];
    if(methods.indexOf(data.method) > -1){
        messagehandler._msg[data.method](data,callback);
    }else{
        callback(null, 404, "{msg : There is no handler for these route}");
    }
}

messagehandler._msg.get = function(data, callback){
  
        // check is token is valid by auth helper function
        authHelper(data, callback);

        // find message
        Message.find({})
        .populate("replies")
        .then(msg => {
            if(!msg) return callback(null, 404, "{msg: msg not found}");
            callback(null, 200, JSON.stringify(msg));
        })
        .catch(ex => {
            callback(ex);
        })
}

messagehandler._msg.post = function(data, callback){

     // check is token is valid by auth helper function
     authHelper(data, callback);

    // get data paylaod
    const { content, author } = data.payload;
    if(!content || !author){
        return callback(null, 400, "Bad Request");
    }

    let payload = data.payload;
    let msg = new Message();
    msg.content = payload.content;
    msg.author = payload.author;

    msg.save()
    .then(msg => {
        callback(null , 200, JSON.stringify(msg));
    })
    .catch(ex => {
        callback(ex);
    })

}

messagehandler._msg.delete = function(data, callback){

     // check is token is valid by auth helper function
     authHelper(data, callback);

    // delete message by id
    // get id from payload
    let payload = data.payload;
    let id = payload.id;
    if(!id){
        callback(null, 404, '{msg: Message Not Found}');
    }

    Message.findByIdAndRemove({ _id: id})
    .then(msg => {
        if(!msg) { return callback(null, 404, "{msg: message with these id not found}") }
        callback(null, 200, JSON.stringify(msg))
    })
    .catch(ex => {
        callback(ex);
    });
}

messagehandler._msg.put = function(data, callback){

     // check is token is valid by auth helper function
     authHelper(data, callback);
     
    const { id, content, author } = data.payload;

    if(!id){ return callback(null, 400, '{msg: id is missing}')}
    if(!content && !author) { return callback(null, 400, '{msg: data is missing}')}

    let payload = data.payload;
    
    Message.findByIdAndUpdate({ _id: payload.id}, { content: payload.content, author: payload.author}, {new: true})
    .then(msg => {
        if(!msg){ return callback(null, 404, "{msg: message with these id not found}")}
        callback(null, 200, JSON.stringify(msg));
    })
    .catch(ex => {
        callback(ex);
    })
}

module.exports = messagehandler