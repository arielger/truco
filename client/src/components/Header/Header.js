import React from "react";
import * as R from "ramda";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./Header.module.scss";
import "@reach/menu-button/styles.css";

export default function Header({ user }) {
  return (
    <div className={styles["header"]}>
      <h2 className={styles["title"]}>Truco</h2>
      <Menu>
        <MenuButton className={styles.menuButton}>
          <img
            className={styles["avatar"]}
            src={R.prop("avatar", user)}
            alt=""
          />
          <span aria-hidden>
            <FontAwesomeIcon icon={faCaretDown} />
          </span>
        </MenuButton>
        <MenuList className={styles.menuList}>
          <MenuItem
            onSelect={() => {
              localStorage.removeItem("token");
              location.reload(); //eslint-disable-line no-restricted-globals
            }}
          >
            <FontAwesomeIcon className={styles.menuIcon} icon={faSignOutAlt} />
            Cerrar sesión
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
