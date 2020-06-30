import React from "react";
import { gql } from "@apollo/client";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Login, Matches, Match } from "./screens";
import Spinner from "./components/Spinner";
import UserTracking from "./components/UserTracking";

import {
  useFetchLocalProfileQuery,
  useFetchProfileLazyQuery,
} from "./types/graphql";

import styles from "./App.module.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FETCH_PROFILE = gql`
  query fetchProfile {
    user {
      id
      name
      avatar
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FETCH_LOCAL_PROFILE = gql`
  query fetchLocalProfile {
    user @client {
      id
      name
      avatar
    }
    token @client
  }
`;

export default function Routes() {
  const { data: localProfileData } = useFetchLocalProfileQuery({
    returnPartialData: true, // Fix query not updating after login
  });

  const { token, user } = localProfileData || {};

  const isLoggedIn = Boolean(token);

  const [
    fetchProfile,
    { loading: loadingFetchProfile },
  ] = useFetchProfileLazyQuery({ fetchPolicy: "network-only" });

  // Fetch user profile if user is logged in (token is present) but profile is not loaded yet
  React.useEffect(() => {
    if (isLoggedIn && !user) {
      fetchProfile();
    }
  }, [isLoggedIn, fetchProfile, user]);

  const isUserStatusLoaded = !isLoggedIn || (isLoggedIn && user);

  if (loadingFetchProfile || !isUserStatusLoaded) {
    return <Spinner fullHeight />;
  }

  return (
    <BrowserRouter>
      <UserTracking />
      {isLoggedIn && user ? (
        <div className={styles["layout"]}>
          <Switch>
            <Route
              path="/partidas/:matchId"
              render={({ ...routeProps }) => (
                <Match user={user} {...routeProps} />
              )}
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
