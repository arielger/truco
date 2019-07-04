const { gql } = require("apollo-server");

const matchFields = `
  id: ID!
  status: MatchStatus!
  playersCount: Int!
  points: Int!
  creator: Player!
  players: [Player]!
`;

const typeDefs = gql`
  enum MatchStatus {
    waiting
    playing
    finished
  }

  enum Team {
    we
    them
  }

  enum TrucoType {
    TRUCO
    RETRUCO
    VALE_CUATRO
  }

  enum TrucoStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  enum EnvidoType {
    ENVIDO
    REAL_ENVIDO
    FALTA_ENVIDO
  }

  enum EnvidoStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type Truco {
    type: TrucoType!
    status: TrucoStatus!
    team: Team!
    hand: Int!
  }

  type Envido {
    list: [EnvidoType]!
    status: EnvidoStatus!
    team: Team!
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
    myCards: [Card!]!
    nextPlayer: ID
    isLastPlayerFromTeam: Boolean
    cardsPlayedByPlayer: [cardsByPlayer!]!
    roundWinnerTeam: Team
    matchWinnerTeam: Team
    myPoints: Int
    theirPoints: Int
    truco: Truco
    envido: Envido
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
    TRUCO_ACTION
    ENVIDO_ACTION
  }

  type MatchUpdate {
    type: MatchUpdateType
    ${matchFields}
    myCards: [Card!]
    nextPlayer: ID
    isLastPlayerFromTeam: Boolean
    cardsPlayedByPlayer: [cardsByPlayer!]
    roundWinnerTeam: Team
    matchWinnerTeam: Team
    myPoints: Int
    theirPoints: Int
    truco: Truco
    envido: Envido
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

   enum EnvidoActions {
     ENVIDO
     REAL_ENVIDO
     FALTA_ENVIDO
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
    playEnvido(matchId: ID!, action: EnvidoActions!): MatchUpdateResponse!
  }

  type Subscription {
    matchListUpdated: MatchListUpdate!
    matchUpdated(matchId: ID!): MatchUpdate!
  }
`;

module.exports = typeDefs;
