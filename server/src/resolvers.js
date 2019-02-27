const { pubsub, events } = require("./subscriptions");

module.exports = {
  Query: {
    matches: async (parent, args, { dataSources }) =>
      dataSources.matchAPI.getAllMatches(),
    match: async (_, { id }, { dataSources }) =>
      dataSources.matchAPI.getMatchById({ matchId: id })
  },
  Mutation: {
    createMatch: (parent, { input }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to create a match");
      }
      return dataSources.matchAPI.createMatch({ match: input, userId });
    },
    logInAsGuest: (parent, args, { dataSources }) =>
      dataSources.userAPI.logInAsGuest()
  },
  Subscription: {
    matchAdded: {
      subscribe: () => pubsub.asyncIterator(events.MATCH_ADDED)
    }
  }
};
