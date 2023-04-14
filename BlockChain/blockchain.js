const Block = require("./block");
const generateBlockHash = require("./cryptoHash");

class BlockChain {
  constructor() {
    this.chain = [Block.genesisBlock()];
  }

  /**
   * this block is to add the block in current chain
   */

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data: data,
    });
    this.chain.push(newBlock);
  }

  /**
   this code segment is to replace the incomming chain comming from miner 
   as this 
   -> longest chain to be accepted
   -> validate the incomming chain with the current chain
   */
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      // always select the longest chain
      console.error("the chain provided is not longer than current chain");
      return;
    }

    if (!this.isValidChain(chain)) {
      // check whether the given chain is valid or not
      console.error("the chain provided is not valid");
      return;
    }

    this.chain = chain;
  }

  /* 
    this code segment is to check whether the incomming chain is valid or not
    ->check whether the block is genesis block or some other malicous block
    
    */
  
    isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const { timeStamp, prevHash, hash, data, difficulty, nonce } = chain[i];
      const lastBlockHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (prevHash !== lastBlockHash) return false;

      const validatedHash = generateBlockHash(
        timeStamp,
        prevHash,
        data,
        difficulty,
        nonce
      );
      if (hash !== validatedHash) return false; // this is to validate the hash for the given block, so that if any malicious miner changed the hash then whole hash will be changed

      if (Math.abs(lastDifficulty - difficulty) > 1) return false; // this is to limit the difficulty and not let the miner increase the difficulty
    }
    return true;
  }
}

// const blockChain = new BlockChain();
// blockChain.addBlock({ data: "this is new block" });
// blockChain.addBlock({ data: "this is 2 block" });

// console.log(blockChain.chain);

module.exports = BlockChain;
