const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

require("dotenv-safe").config();
require("./database");

const MatchAPI = require("./datasources/match");
const UserAPI = require("./datasources/user");
const User = require("./database/models/user");

const PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    matchAPI: new MatchAPI(),
    userAPI: new UserAPI()
  }),
  context: ({ req, connection }) => {
    //www.apollographql.com/docs/apollo-server/features/subscriptions.html#Context-with-Subscriptions
    if (connection) {
      return connection.context;
    }

    const token = req.headers.authorization || "";

    if (token) {
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (!err) {
            resolve({ userId: decoded.id });
          } else {
            resolve();
          }
        });
      });
    }
  }
});

server.listen({ port: PORT }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
