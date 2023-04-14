// all the import files over here
const { GENESIS_BLOCK, MINING_RATE } = require("./genesisBlock");
const generateBlockHash = require("./cryptoHash");
const hexToBinary = require("hex-to-binary");

class Block {
  constructor({ timeStamp, data, prevHash, hash, nonce, difficulty }) {
    this.timeStamp = timeStamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesisBlock() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ prevBlock, data }) {
    let hash, timeStamp;

    const prevHash  = prevBlock.hash;
    let difficulty;
    let nonce = 0;
    do {
      nonce++;
      timeStamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timeStamp: timeStamp,
      });
      hash = generateBlockHash(timeStamp, prevHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    ); //checking the target with the hash that is generated after changing the nonce

    return new this({
      timeStamp: timeStamp,
      data: data,
      prevHash: prevHash,
      hash: hash,
      nonce: nonce,
      difficulty: difficulty,
    });
  }
  

  /**
   * this codesegment is to adjust the difficulty by doing the following steps
   * check the original block (here prev block) with the timestamp passed during mining
   */
  static adjustDifficulty({ originalBlock, timeStamp }) {
    const { difficulty } = originalBlock;

    const difference = timeStamp - originalBlock.timeStamp;
    if (difficulty <= 1) return 1;
    if (difference > MINING_RATE) return difficulty - 1;
    else return difficulty + 1;
  }
}

module.exports = Block;

/* 
    demonstration purpose
*/

// const genesisBlock = Block.genesisBlock();
// const block1 = new Block({
//   timeStamp: Date.now(),
//   data: "hello this is my first block",
//   prevHash: "0x0001",
//   hash: "0x0002",
// });
// const block2 = new Block({
//   timeStamp: Date.now(),
//   data: "hello this is my second block",
//   prevHash: "0x0002",
//   hash: "0x0003",
// });

// const block3 = Block.mineBlock({
//   prevBlock: block2,
//   data: "this is my third block",
// });

// console.log(genesisBlock);
// console.log(block1);
// console.log(block2);
// console.log(block3);
