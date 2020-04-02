// these file for generating token (random strings) for auth
// i will use build-in node.js module (crypto) as jwt is a third party library

// import crypto module
let crypto = require("crypto");

// Array of tokens generated
let allTokensGenerated = [];

// define func that return the token
let __genToken__ = _ => {

    // these function responsible for gen. the token
    let token = crypto.randomBytes(16).toString('hex');

    allTokensGenerated.push(token);
    console.log(allTokensGenerated);

    return token;
}


let isVerifiedToken = token => {
  return allTokensGenerated.indexOf(token) > - 1;
}

module.exports = { __genToken__, isVerifiedToken};

