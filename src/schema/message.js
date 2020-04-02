let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
    content: { type: String, required: true},
    author: {type: String},
    // replays: mongoose.Types.ObjectId
}); 

module.exports = mongoose.model("Message", messageSchema);