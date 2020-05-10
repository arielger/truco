import React from "react";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Login, Matches, Match } from "./screens";
import Spinner from "./components/Spinner";

import styles from "./App.module.scss";

const FETCH_PROFILE = gql`
  query user {
    user {
      id
      name
      avatar
    }
  }
`;

const FETCH_LOCAL_PROFILE = gql`
  query {
    user @client {
      id
      name
      avatar
    }
    token @client
  }
`;

export default function Routes() {
  const {
    data: { token, user },
  } = useQuery(FETCH_LOCAL_PROFILE, {
    returnPartialData: true, // Fix query not updating after login
  });

  const isLoggedIn = !!token;

  const [
    fetchProfile,
    { loading: loadingFetchProfile },
  ] = useLazyQuery(FETCH_PROFILE, { fetchPolicy: "network-only" });

  // Fetch user profile if user is logged in (token is present) but profile is not loaded yet
  React.useEffect(() => {
    if (isLoggedIn && !user) {
      fetchProfile();
    }
  }, [isLoggedIn, fetchProfile, user]);

  if (loadingFetchProfile) return <Spinner fullHeight />;

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <div className={styles["layout"]}>
          <Switch>
            <Route
              path="/partidas/:matchId"
              render={({ ...props }) => <Match user={user} {...props} />}
            />
            <Route path="/partidas" component={Matches} />
            <Redirect to="/partidas" />
          </Switch>
        </div>
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      )}
    </BrowserRouter>
  );
}
