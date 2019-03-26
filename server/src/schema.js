const { gql } = require("apollo-server");

const matchFields = `
  id: ID!
  status: MatchStatus!
  playersCount: Int!
  points: Int!
  creator: Player!
  players: [Player]!
`;

const playerMatchFields = `
  myCards: [Card!]!
  nextPlayer: ID
  cardsPlayedByPlayer: [cardsByPlayer!]!
  roundWinnerTeam: Winner
  matchWinnerTeam: Winner
  myPoints: Int
  theirPoints: Int
`;

const typeDefs = gql`
  enum MatchStatus {
    waiting
    playing
    finished
  }

  enum Winner {
    we
    them
  }

  type Match {
    ${matchFields}
  }

  type Card {
    id: ID!
    card: String!
    played: Boolean!
  }

  type cardsByPlayer {
    playerId: ID!
    cards: [String]
  }

  type PlayerMatch {
    ${matchFields}
    ${playerMatchFields}
  }

  enum MatchListUpdateType {
    NEW_MATCH
    UPDATED_MATCH
    DELETED_MATCH
  }

  type MatchListUpdate {
    type: MatchListUpdateType
    ${matchFields}
  }

  enum MatchUpdateType {
    NEW_PLAYER
    START_GAME
    NEW_MOVE
    NEW_ROUND
  }

  type MatchUpdate {
    type: MatchUpdateType
    ${matchFields}
    ${playerMatchFields}
  }

  type Player {
    id: ID!
    name: String!
    avatar: String
    isFromFirstTeam: Boolean!
  }

  type Query {
    matches: [Match]!
    match(id: ID!): PlayerMatch
    me: Player!
  }

  type LogInResult {
    token: String
  }

  enum TrucoActions {
    TRUCO
    RETRUCO
    VALE_CUATRO
    ACCEPT
    REJECT
  }

  type MatchUpdateResponse {
    success: Boolean!
    message: String
  }

  # @todo: playCard should return MatchUpdatResponse instead of full match
  type Mutation {
    logInAsGuest(name: String!, avatar: String): LogInResult!
    createMatch(playersCount: Int!, points: Int!): Match!
    joinMatch(matchId: ID!): Match!
    playCard(matchId: ID!, cardId: ID!): PlayerMatch!
    playTruco(matchId: ID!, action: TrucoActions!): MatchUpdateResponse! 
  }

  type Subscription {
    matchListUpdated: MatchListUpdate!
    matchUpdated(matchId: ID!): MatchUpdate!
  }
`;

module.exports = typeDefs;
