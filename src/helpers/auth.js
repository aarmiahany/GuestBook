/*
* these file is for Auth Token
*/
let tokenData = require("../tokens/token");

module.exports = function (data, callback) {
    // extract token from req headers
    let extractHeaderToken = data.headers["authorization"];
    // Don't forget that token consists of two parts the first one is tokenId and the second one is token valid date
  
    // check if token exists
    if(!extractHeaderToken){ return callback(null, 401, '{msg: UnAuthorized.. token not exists}')}
  
    // split token body
    let [tokenID, issuedDate] = extractHeaderToken.split(" ");
  
    // check if token date is not expired
    if(Date.now() > issuedDate){ return callback(null, 401, "{msg: token is Date expired} ")}
  
    // check if token id is valid
    if(!tokenData.isValidToken(tokenID)){ return callback(null, 401, "{msg: token is invalid}")}
};