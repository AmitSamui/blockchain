const MINING_RATE=1000
const INITIAL_DIFFICULTY = 2;
const GENESIS_BLOCK = {
  timeStamp: Date.now(),
  data: [],
  prevHash: "0x0000",
  hash: "0x0001",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};
module.exports = { GENESIS_BLOCK , MINING_RATE };
