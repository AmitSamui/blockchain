// all the import modules are here
const crypto = require("crypto");


//this is the function which will produce the hash for a block
const generateBlockHash = (...inputs ) => {
  // { ...inputs } this means whatever the parameters are they will be used as an object
  const hash = crypto.createHash("sha256"); // shows which algorithm to dgo with
  hash.update(inputs.sort().join("")); // this will join all the inputs
  return hash.digest("hex") ; // this will make the hash in hexadecimal form
};

module.exports =  generateBlockHash ;
