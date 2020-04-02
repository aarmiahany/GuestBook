let userHandler = require("../handlers/users/user");
let messageHandler = require("../handlers/messages/messages");
let notFound = require("../handlers/notFound/notFound");

let router = {
    'user/create': userHandler._users,
    'user/login': userHandler._loginUser,
    'message': messageHandler._msg,
     notFound
}

module.exports = router;