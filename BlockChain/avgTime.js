const BlockChain = require("./blockchain");

const blockChain = new BlockChain();

let prevTimeStamp, nextTimeStamp, nextBlock, timeDiff, averageTime;

const times = [];

for (let i = 0; i < 1000; i++) {
  prevTimeStamp = blockChain.chain[blockChain.chain.length - 1].timeStamp;
  blockChain.addBlock({ data: `data ${i}` });
  nextBlock = blockChain.chain[blockChain.chain.length - 1];
  nextTimeStamp = nextBlock.timeStamp;

  timeDiff = nextTimeStamp - prevTimeStamp;
  times.push(timeDiff);

  averageTime = times.reduce((total, num) => total + num) / times.length;
  console.log(`time to mine block: ${timeDiff}ms difficulty: ${nextBlock.difficulty} average time: ${averageTime}ms`);
}
