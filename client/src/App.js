import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  split,
  HttpLink,
  gql,
} from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { onError } from "@apollo/link-error";
import { WebSocketLink } from "@apollo/link-ws";
import { setContext } from "@apollo/link-context";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ReactModal from "react-modal";

import Routes from "./Routes";

ReactModal.setAppElement("#root");

const authLink = setContext((_, { headers = {} }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

const networkInterface = new HttpLink({
  uri: process.env.REACT_APP_API_URL,
});

// Create WebSocket client
const wsClient = new SubscriptionClient(
  process.env.REACT_APP_SUBSCRIPTIONS_URL,
  {
    reconnect: true,
    connectionParams: () => ({
      authorization: localStorage.getItem("token") || "",
    }),
  }
);

const webSocketLink = new WebSocketLink(wsClient);

const requestLink = ({ queryOrMutationLink, subscriptionLink }) =>
  split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    subscriptionLink,
    queryOrMutationLink
  );

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions.code === "UNAUTHENTICATED") {
        localStorage.removeItem("token");
        location.reload(); //eslint-disable-line no-restricted-globals
      }
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([
  errorLink,
  requestLink({
    queryOrMutationLink: authLink.concat(networkInterface),
    subscriptionLink: webSocketLink,
  }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

client.writeQuery({
  query: gql`
    query {
      token
      user
    }
  `,
  data: {
    token: localStorage.getItem("token"),
    user: null,
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
};

export default App;
