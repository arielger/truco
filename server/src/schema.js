const { gql } = require("apollo-server");

const typeDefs = gql`
  type Match {
    id: ID!
    playersCount: Int!
    points: Int!
    creator: Player!
    players: [Player]!
  }

  type Player {
    id: ID!
    name: String
    avatar: String
  }

  type Query {
    matches: [Match]!
    match(id: ID!): Match
  }

  type LogInResult {
    token: String
  }

  type Mutation {
    logInAsGuest(name: String!, avatar: String): LogInResult!
    createMatch(playersCount: Int!, points: Int!): Match!
    joinMatch(matchId: String!): Match!
  }

  type Subscription {
    matchAdded: Match!
  }
`;

module.exports = typeDefs;
