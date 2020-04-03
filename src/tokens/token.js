// these file for generating token (random strings) for auth
// i will use build-in node.js module (crypto) as jwt is a third party library

// import crypto module
let crypto = require("crypto");

// Array of all tokens generated
let allTokensGenerated = [];

// define func that return the token
let __genToken__ = email => {
     
      // in token object we will asign the user email as a payload
      // gen salt
      let salt = crypto.randomBytes(16).toString('hex'); 
      // these function responsible for gen. the token
      let tokenId = crypto.pbkdf2Sync(email, salt,  
      1000, 64, `sha512`).toString(`hex`); 

      // set token expire Date
      // the token is valid only for one hour
      let issuedDate = Date.now() + 1000 * 60 * 60;
      
      // create token obj
      let token = new Object();
      token['tokenID'] = tokenId;
      token['issuedDate'] = issuedDate;

      // save the token in memory storage
      allTokensGenerated.push(tokenId);

      // return the token issued
      return token;
}


let isValidToken = tokenID => {
  return allTokensGenerated.indexOf(tokenID) > - 1;
}

module.exports = { __genToken__, isValidToken};

