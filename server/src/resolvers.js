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
    match: async (_, { id }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to access match data");
      }

      return dataSources.matchAPI.getMatchById({ matchId: id, userId });
    },
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
    },
    playCard: (parent, { matchId, cardId }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to play a card");
      }
      return dataSources.matchAPI.playCard({ matchId, userId, cardId });
    },
    playTruco: (parent, { matchId, action }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to send truco action");
      }
      return dataSources.matchAPI.playTruco({ matchId, userId, action });
    },
    playEnvido: (parent, { matchId, action }, { userId, dataSources }) => {
      if (!userId) {
        throw new Error("You must be logged in to send truco action");
      }
      return dataSources.matchAPI.playEnvido({ matchId, userId, action });
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
        () =>
          pubsub.asyncIterator([
            events.NEW_PLAYER,
            events.START_GAME,
            events.NEW_MOVE,
            events.NEW_ROUND,
            events.TRUCO_ACTION,
            events.ENVIDO_ACTION
          ]),
        (payload, variables, context) => {
          const isSubscribedToMatch =
            variables.matchId === payload.matchUpdated.id;
          // If update is only for one user (e.g. when the update contains the user cards)
          const isUpdateForUser = payload.userId
            ? payload.userId === context.userId
            : true;
          return isSubscribedToMatch && isUpdateForUser;
        }
      )
    }
  }
};
