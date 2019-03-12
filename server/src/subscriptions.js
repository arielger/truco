const { PubSub } = require("apollo-server");

module.exports = {
  pubsub: new PubSub(),
  events: {
    MATCH_ADDED: "MATCH_ADDED",
    MATCH_UPDATED: "MATCH_UPDATED",
    MATCH_REMOVED: "MATCH_REMOVED"
  }
};
