let mongoose = require("mongoose");

let replySchema = new mongoose.Schema({
    content: { type: String, required: true},
}); 

module.exports = mongoose.model("Reply", replySchema);