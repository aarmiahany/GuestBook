let userHandler = require("../handlers/users/user");
let messageHandler = require("../handlers/messages/messages");
let replyHandler = require("../handlers/reply/reply");
let notFound = require("../handlers/notFound/notFound");

let router = {
    'user/create': userHandler._createUser,
    'user/login': userHandler._loginUser,
    'message': messageHandler._msg,
    'message/reply': replyHandler._reply,
     notFound
}

module.exports = router;