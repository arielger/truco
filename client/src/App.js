import React, { Fragment } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import gql from "graphql-tag";
import ReactModal from "react-modal";

import { Login, Matches, Match } from "./screens";

ReactModal.setAppElement("#root");

const authLink = setContext((_, { headers = {} }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token || ""
    }
  };
});

const networkInterface = new HttpLink({
  uri: "http://localhost:4000"
});

// Create WebSocket client
const wsClient = new SubscriptionClient(`ws://localhost:4000/graphql`, {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  }
});

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

const link = ApolloLink.from([
  requestLink({
    queryOrMutationLink: authLink.concat(networkInterface),
    subscriptionLink: webSocketLink
  })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

client.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    token: localStorage.getItem("token")
  }
});

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

const App = () => {
  return (
    <div id="main">
      <ApolloProvider client={client}>
        <Query query={IS_LOGGED_IN}>
          {({ data: { isLoggedIn } }) => (
            <Fragment>
              <BrowserRouter>
                {isLoggedIn ? (
                  <Switch>
                    <Route path="/matches" component={Matches} />
                    <Route path="/match/:matchId" component={Match} />
                    <Redirect to="/matches" />
                  </Switch>
                ) : (
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Redirect to="/login" />
                  </Switch>
                )}
              </BrowserRouter>
              {isLoggedIn && (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    client.writeData({
                      data: { isLoggedIn: false, token: null }
                    });
                  }}
                >
                  Log out
                </button>
              )}
            </Fragment>
          )}
        </Query>
      </ApolloProvider>
    </div>
  );
};

export default App;
