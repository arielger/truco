const { withFilter, AuthenticationError } = require("apollo-server");

const { pubsub, events } = require("./subscriptions");

const authenticateRoute = (next) => (parent, args, context) => {
  if (!context.userId) {
    throw new AuthenticationError(
      "You must be logged in to perform this action"
    );
  }
  return next(parent, args, context);
};

module.exports = {
  Query: {
    matches: authenticateRoute((parent, args, { userId, dataSources }) =>
      dataSources.matchAPI.getAllMatches({ userId })
    ),
    match: authenticateRoute((parent, { id }, { userId, dataSources }) =>
      dataSources.matchAPI.getMatchById({ matchId: id, userId })
    ),
    user: authenticateRoute((parent, args, { userId, dataSources }) =>
      dataSources.userAPI.getUserInfo({ userId })
    ),
  },
  Mutation: {
    createMatch: authenticateRoute(
      (parent, { playersCount, points }, { userId, dataSources }) =>
        dataSources.matchAPI.createMatch({ playersCount, points, userId })
    ),
    logInAsGuest: (parent, { name }, { dataSources }) =>
      dataSources.userAPI.logInAsGuest({ name }),
    logInWithFacebook: async (
      parent,
      { accessToken },
      { dataSources, req, res }
    ) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };

      return dataSources.userAPI.logInWithFacebook({
        req,
        res,
      });
    },
    logInWithGoogle: async (
      parent,
      { accessToken },
      { dataSources, req, res }
    ) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };

      return dataSources.userAPI.logInWithGoogle({
        req,
        res,
      });
    },
    joinMatch: authenticateRoute(
      (parent, { matchId }, { userId, dataSources }) =>
        dataSources.matchAPI.joinMatch({ matchId, userId })
    ),
    leaveMatch: authenticateRoute(
      (parent, { matchId }, { userId, dataSources }) =>
        dataSources.matchAPI.leaveMatch({ matchId, userId })
    ),
    playCard: authenticateRoute(
      (parent, { matchId, cardId }, { userId, dataSources }) =>
        dataSources.matchAPI.playCard({ matchId, userId, cardId })
    ),
    playTruco: authenticateRoute(
      (parent, { matchId, action }, { userId, dataSources }) =>
        dataSources.matchAPI.playTruco({ matchId, userId, action })
    ),
    playEnvido: authenticateRoute(
      (parent, { matchId, action }, { userId, dataSources }) =>
        dataSources.matchAPI.playEnvido({ matchId, userId, action })
    ),
    sayEnvido: authenticateRoute(
      (parent, { matchId, action }, { userId, dataSources }) =>
        dataSources.matchAPI.sayEnvido({ matchId, userId, action })
    ),
    leaveRound: authenticateRoute(
      (parent, { matchId }, { userId, dataSources }) =>
        dataSources.matchAPI.leaveRound({ matchId, userId })
    ),
  },
  Subscription: {
    matchListUpdated: {
      subscribe: () =>
        pubsub.asyncIterator([
          events.MATCH_ADDED,
          events.MATCH_UPDATED,
          events.MATCH_REMOVED,
        ]),
    },
    matchUpdated: {
      subscribe: withFilter(
        () =>
          pubsub.asyncIterator([
            events.NEW_PLAYER,
            events.PLAYER_LEFT_GAME,
            events.CREATOR_LEFT_GAME,
            events.START_GAME,
            events.NEW_MOVE,
            events.NEW_ROUND,
            events.TRUCO_ACTION,
            events.ENVIDO_ACTION,
            events.LEAVE_ROUND,
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
      ),
    },
  },
};
