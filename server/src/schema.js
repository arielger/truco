const { gql } = require("apollo-server");

const matchFields = `
  id: ID!
  playersCount: Int!
  points: Int!
  creator: Player!
  players: [Player]!
`;

const typeDefs = gql`
  type Match {
    ${matchFields}
  }

  enum MatchUpdateType {
    NEW_MATCH
    UPDATED_MATCH
    DELETED_MATCH
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
    matchUpdated: MatchUpdate!
  }
`;

module.exports = typeDefs;
