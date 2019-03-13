const { withFilter } = require("apollo-server");

const { pubsub, events } = require("./subscriptions");

module.exports = {
  Query: {
    matches: async (parent, args, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to get the matches list");
      }

      return dataSources.matchAPI.getAllMatches({ userId });
    },
    match: async (_, { id }, { dataSources }) =>
      dataSources.matchAPI.getMatchById({ matchId: id }),
    me: async (_, { id }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to get your profile");
      }
      return dataSources.userAPI.getUserInfo({ userId });
    }
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
    matchListUpdated: {
      subscribe: () =>
        pubsub.asyncIterator([
          events.MATCH_ADDED,
          events.MATCH_UPDATED,
          events.MATCH_REMOVED
        ])
    },
    matchUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([events.NEW_PLAYER, events.NEW_MOVE]),
        (payload, variables) => variables.matchId === payload.matchUpdated.id
      )
    }
  }
};
