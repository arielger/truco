import React from "react";
import * as R from "ramda";

import styles from "./Header.module.scss";

export default function Header({ client, user }) {
  return (
    <div className={styles["header"]}>
      <h2 className={styles["title"]}>Truco</h2>
      <div className={styles["right-container"]}>
        <h4>{R.prop("name", user)}</h4>
        <img className={styles["avatar"]} src={R.prop("avatar", user)} alt="" />
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
