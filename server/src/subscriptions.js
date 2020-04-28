const { PubSub } = require("apollo-server");

module.exports = {
  pubsub: new PubSub(),
  events: {
    // Matches list
    MATCH_ADDED: "MATCH_ADDED",
    MATCH_UPDATED: "MATCH_UPDATED",
    MATCH_REMOVED: "MATCH_REMOVED",

    NEW_PLAYER: "NEW_PLAYER",
    PLAYER_LEFT_GAME: "PLAYER_LEFT_GAME",
    CREATOR_LEFT_GAME: "CREATOR_LEFT_GAME",
    START_GAME: "START_GAME",
    NEW_MOVE: "NEW_MOVE",
    TRUCO_ACTION: "TRUCO_ACTION",
    ENVIDO_ACTION: "ENVIDO_ACTION",
    NEW_ROUND: "NEW_ROUND",
  },
};
