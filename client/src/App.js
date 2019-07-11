import React, { Fragment } from "react";
import * as R from "ramda";
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
import Header from "./components/Header";
import styles from "./App.module.scss";

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
  uri: process.env.REACT_APP_API_URL
});

// Create WebSocket client
const wsClient = new SubscriptionClient(
  process.env.REACT_APP_SUBSCRIPTIONS_URL,
  {
    reconnect: true,
    connectionParams: () => ({
      authorization: localStorage.getItem("token") || ""
    })
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
  query isLoggedIn {
    isLoggedIn @client
  }
`;

const FETCH_PROFILE = gql`
  query fetchProfile {
    me {
      id
      avatar
      name
    }
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
                  <div className={styles["layout"]}>
                    <Query query={FETCH_PROFILE}>
                      {({ data, loading, error }) => {
                        if (loading) return "Loading";
                        const user = R.prop("me", data);
                        return (
                          <>
                            <Header client={client} user={user} />
                            <Switch>
                              <Route path="/matches" component={Matches} />
                              <Route
                                path="/match/:matchId"
                                render={({ ...props }) => (
                                  <Match user={user} {...props} />
                                )}
                              />
                              <Redirect to="/matches" />
                            </Switch>
                          </>
                        );
                      }}
                    </Query>
                  </div>
                ) : (
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Redirect to="/login" />
                  </Switch>
                )}
              </BrowserRouter>
            </Fragment>
          )}
        </Query>
      </ApolloProvider>
    </div>
  );
};

export default App;
