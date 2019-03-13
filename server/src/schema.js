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
    NEW_MOVE
  }

  type MatchUpdate {
    type: MatchUpdateType
    ${matchFields}
  }

  type Player {
    id: ID!
    name: String!
    avatar: String
  }

  type Query {
    matches: [Match]!
    match(id: ID!): Match
    me: Player!
  }

  type LogInResult {
    token: String
  }

  type Mutation {
    logInAsGuest(name: String!, avatar: String): LogInResult!
    createMatch(playersCount: Int!, points: Int!): Match!
    joinMatch(matchId: ID!): Match!
  }

  type Subscription {
    matchListUpdated: MatchListUpdate!
    matchUpdated(matchId: ID!): MatchUpdate!
  }
`;

module.exports = typeDefs;
