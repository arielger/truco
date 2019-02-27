const { gql } = require("apollo-server");

const typeDefs = gql`
  input MatchInput {
    playersCount: Int!
    points: Int!
  }

  type Match {
    id: ID!
    playersCount: Int!
    points: Int!
    creator: Player!
  }

  type Player {
    id: ID!
    name: String
  }

  type Query {
    matches: [Match]!
    match(id: ID!): Match
  }

  type LogInResult {
    token: String
  }

  type Mutation {
    logInAsGuest: LogInResult!
    createMatch(input: MatchInput!): Match!
  }

  type Subscription {
    matchAdded: Match!
  }
`;

module.exports = typeDefs;
