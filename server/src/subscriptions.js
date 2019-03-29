const { PubSub } = require("apollo-server");

module.exports = {
  pubsub: new PubSub(),
  events: {
    MATCH_ADDED: "MATCH_ADDED",
    MATCH_UPDATED: "MATCH_UPDATED",
    MATCH_REMOVED: "MATCH_REMOVED",

    NEW_PLAYER: "NEW_PLAYER",
    START_GAME: "START_GAME",
    NEW_MOVE: "NEW_MOVE",
    TRUCO_ACTION: "TRUCO_ACTION",
    NEW_ROUND: "NEW_ROUND"
  }
};
