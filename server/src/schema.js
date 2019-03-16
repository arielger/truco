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

  type Match {
    ${matchFields}
  }

  type Card {
    id: ID!,
    card: String!
    played: Boolean!
  }

  type PlayerMatch {
    myCards: [Card]!
    ${matchFields}
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
  }

  type MatchUpdate {
    type: MatchUpdateType
    myCards: [Card]!
    ${matchFields}
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

  type Mutation {
    logInAsGuest(name: String!, avatar: String): LogInResult!
    createMatch(playersCount: Int!, points: Int!): Match!
    joinMatch(matchId: ID!): Match!
    playCard(matchId: ID!, cardId: ID!): [Card]!
  }

  type Subscription {
    matchListUpdated: MatchListUpdate!
    matchUpdated(matchId: ID!): MatchUpdate!
  }
`;

module.exports = typeDefs;
