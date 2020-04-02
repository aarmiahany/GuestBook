let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
    content: { type: String, required: true},
    author: {type: String},
    replies: { type: mongoose.Schema.Types.ObjectId, ref: "Reply"}
}); 

module.exports = mongoose.model("Message", messageSchema);