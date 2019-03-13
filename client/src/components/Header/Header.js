import React from "react";
import * as R from "ramda";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import styles from "./Header.module.scss";

const FETCH_PROFILE = gql`
  {
    me {
      avatar
      name
    }
  }
`;

export default function Header({ client }) {
  return (
    <div className={styles["header"]}>
      <h2 className={styles["title"]}>Truco</h2>
      <div className={styles["right-container"]}>
        <Query query={FETCH_PROFILE}>
          {({ data, loading, error }) => (
            <>
              <h4>{R.path(["me", "name"], data)}</h4>
              <img
                className={styles["avatar"]}
                src={R.path(["me", "avatar"], data)}
                alt=""
              />
            </>
          )}
        </Query>
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
      </div>
    </div>
  );
}
