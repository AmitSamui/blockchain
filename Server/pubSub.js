const redis = require("redis");

// the main use of this module is to make different channels using PUBLISHER SUBSCRIBER MODEL so that we can enact the
// immutable distributor ledger

const CHANNEL = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockChain }) {
    this.blockchain = blockChain;
    this.publisher = redis.createClient(); // creating publisher
    this.subscriber = redis.createClient(); // creating subscriber

    this.subscriber.subscribe(CHANNEL.TEST); // subscribing to a particular channel
    this.subscriber.subscribe(CHANNEL.BLOCKCHAIN);
    this.subscriber.on(
      "message",
      (
        channel,
        message // if publisher publishes any object or data , that will be handled by message
      ) => this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    const parseMessage = JSON.parse(message);

    if (channel === CHANNEL.BLOCKCHAIN) {
      this.blockchain.replaceChain(parseMessage);
    }
  }

  publish({ channel, message }) {
    // publishing data to the given channel
    this.publisher.publish(channel, message);
  }

  broadCastChain() {
    // publishes the initial blockchain as the server is started
    this.publish({
      channel: CHANNEL.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

// const pubsub = new PubSub();
// setTimeout(() => {
//   pubsub.publisher.publish(CHANNEL.TEST, "HELLOOOO");
// }, 1000);

module.exports = PubSub;
