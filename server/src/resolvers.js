const { pubsub, events } = require("./subscriptions");

module.exports = {
  Query: {
    matches: async (parent, args, { dataSources }) =>
      dataSources.matchAPI.getAllMatches(),
    match: async (_, { id }, { dataSources }) =>
      dataSources.matchAPI.getMatchById({ matchId: id })
  },
  Mutation: {
    createMatch: (
      parent,
      { playersCount, points },
      { userId, dataSources }
    ) => {
      if (!userId) {
        throw new Error("You must be logged in to create a match");
      }
      return dataSources.matchAPI.createMatch({ playersCount, points, userId });
    },
    logInAsGuest: (parent, { name, avatar }, { dataSources }) =>
      dataSources.userAPI.logInAsGuest({ name, avatar }),
    joinMatch: (parent, { matchId }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to join a match");
      }
      return dataSources.matchAPI.joinMatch({ matchId, userId });
    }
  },
  Subscription: {
    matchUpdated: {
      subscribe: () =>
        pubsub.asyncIterator([
          events.MATCH_ADDED,
          events.MATCH_UPDATED,
          events.MATCH_REMOVED
        ])
    }
  }
};
