import React from "react";

import styles from "./Header.module.scss";

export default function Header({ client }) {
  return (
    <div className={styles["header"]}>
      <h2 className={styles["title"]}>Truco</h2>
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
  );
}
