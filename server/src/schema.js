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
    logInAsGuest: LogInResult!
    createMatch(input: MatchInput!): Match!
    joinMatch(matchId: String): Match!
  }

  type Subscription {
    matchAdded: Match!
  }
`;

module.exports = typeDefs;
