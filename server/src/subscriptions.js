const { PubSub } = require("apollo-server");

module.exports = {
  pubsub: new PubSub(),
  events: {
    MATCH_ADDED: "MATCH_ADDED"
  }
};
