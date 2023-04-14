const bodyParser = require("body-parser");
const express = require("express");
const BlockChain = require("../BlockChain/blockchain");
const PubSub = require("./pubSub");
const request = require("request");
const { response } = require("express");

const app = express();
app.use(bodyParser.json());
const blockChain = new BlockChain();
const pubSub = new PubSub({ blockChain });

const DEFAULT_PORT = 3000;
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
setTimeout(() => {
  pubSub.broadCastChain();
}, 1000);

app.get("/api/blocks", (req, res) => {
  res.json(blockChain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockChain.addBlock({ data });
  pubSub.broadCastChain();
  res.redirect("/api/blocks");
});

const syncChain = () =>{ 
  request({url: `${ROOT_NODE_ADDRESS}/api/blocks`} , (error , response , body) => {
    if(!error && response.statusCode === 200){
      const rootChain = JSON.parse(body);
      console.log('Replace chain on sync with  , ' , rootChain)
      blockChain.replaceChain(rootChain)
    }
  })
}



const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  
  console.log("listening on port " + PORT);
  syncChain()
});
